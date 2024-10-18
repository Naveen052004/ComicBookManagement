// app.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(cors());

//Have written this for checking Collections that are existing Not requried for execution of application

async function listCollections() {
    try {
      const collections = await mongoose.connection.db.listCollections().toArray();
      console.log('Collections in the database:');
      collections.forEach(collection => {
        console.log(collection.name);
      });
    } catch (error) {
      console.error('Error retrieving collections:', error.message);
    } finally {
      mongoose.connection.close(); // Close the connection when done
    }
  }

mongoose.connect('mongodb://localhost:27017/ComicBook');
  

mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to MongoDB');
  });
  
  mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
  });
  
const bookSchema = new mongoose.Schema({
    bookName: String,
    authorName: String,
    yearOfPublication: String,
    price: Number,
    discount: {
      type: Number,
      default: 0,
    },
    numberOfPages: Number,
    condition: String,
    description: {
      type: String,
      default: 'No description provided',
    },
    additionalData:String,
  });

const BookDetails = mongoose.model('bookdetails', bookSchema);

app.get('/', (req, res) => {
    res.send('Hello, Express!');
});

// app.get('/books', async (req, res) => {
//     console.log(req.query);
//     try {
//       const books = await BookDetails.find();
//     //   console.log(books.length);
//     // console.log(books);
//       res.send(books);
//     } catch (error) {
//       res.send(error);
//     }
//   });

// server.js or routes file
app.get('/books', async (req, res) => {
    try {
        const { page = 1, limit = 10, sort = 'bookName', order = 'asc', authorName, yearOfPublication, price, condition } = req.query;

        // Convert page and limit to numbers
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);

        // Build filter criteria
        const query = {};
        
        // Flexible filter by author name (prefix match)
        if (authorName) {
            query.authorName = { $regex: `^${authorName}`, $options: 'i' }; // Case-insensitive prefix match
        }

        // Flexible filter by book name (prefix match)
        if (req.query.bookName) {
            query.bookName = { $regex: `^${req.query.bookName}`, $options: 'i' }; // Case-insensitive prefix match
        }

        // Flexible filter by year of publication (exact match)
        if (yearOfPublication) {
            // query.yearOfPublication = parseInt(yearOfPublication);
            query.yearOfPublication = { $regex:  `^${yearOfPublication}`};
        }

        // Flexible filter by max price
        if (price) {
            query.price = { $lte: parseFloat(price) }; // Books with price less than or equal to the given price
        }

        // Flexible filter by condition
        if (condition) {
            query.condition = condition; // Exact match
        }

        // Fetch books with pagination, filtering, and sorting
        let books = [];
        books = await BookDetails.find(query)
            .sort({ [sort]: order === 'asc' ? 1 : -1 })
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber);

        // Count total documents for pagination
        const totalCount = await BookDetails.countDocuments(query); // Count based on the same query
        // console.log(books);
        // console.log('After');
        // Respond with the data
        res.json({
            total: totalCount,
            page: pageNumber,
            totalPages: Math.ceil(totalCount / limitNumber),
            books,
        });
    } catch (error) {
        console.log("Getting an erroe");
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/books/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const comicBook = await BookDetails.findById(id);

        if (!comicBook) {
            return res.status(404).json({ message: 'Comic Book not found' });
        }

        res.status(200).json(comicBook);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/books', async (req, res) => {
    try {
        console.log(req.body);
        const newBook = new BookDetails(req.body);
        console.log(newBook);
        await newBook.save();
        res.status(201).json(newBook);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/booksBulk', async (req, res) => {
    try {
        const newBook = await BookDetails.insertMany(req.body);
        // await newBook.save();
        res.status(201).json(newBook);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/api/booksUpdate/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedBook = await BookDetails.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        console.log(id);
        console.log(req.body);
        if (!updatedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }

        res.status(200).json(updatedBook);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/booksDelete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await BookDetails.findByIdAndDelete(id);
        res.status(200).send("Succesfully Deleted the row"); // No content
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Start the server
app.listen(5000, () => {
    console.log(`Server is running on http://localhost:${5000}`);
});
