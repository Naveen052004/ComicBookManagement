// src/BookForm.js
import React, { useState } from 'react';
import './BookForm.css'; // Importing CSS for the form

const BookForm = ({onClose}) => {
  const [formData, setFormData] = useState({
    bookName: '',
    authorName: '',
    yearOfPublication: '',
    price: '',
    discount: '',
    numberOfPages: '',
    condition: 'new',
    description: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch('http://localhost:5000/api/books', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Book added:', data);
            onClose();
            // Optionally, reset the form or show a success message
        } else {
            throw new Error('Failed to add book');
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  return (
    <div className="container">
      <h1>Add Book Details</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <div className="field">
            <label htmlFor="bookName">Book Name</label>
            <input
              type="text"
              id="bookName"
              name="bookName"
              value={formData.bookName}
              onChange={handleChange}
              
            />
          </div>
          <div className="field">
            <label htmlFor="authorName">Author Name</label>
            <input
              type="text"
              id="authorName"
              name="authorName"
              value={formData.authorName}
              onChange={handleChange}
              
            />
          </div>
        </div>
        <div className="form-group">
          <div className="field">
            <label htmlFor="yearOfPublication">Year of Publication</label>
            <input
              type="number"
              id="yearOfPublication"
              name="yearOfPublication"
              value={formData.yearOfPublication}
              onChange={handleChange}
              
            />
          </div>
          <div className="field">
            <label htmlFor="price">Price</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              
            />
          </div>
        </div>
        <div className="form-group">
          <div className="field">
            <label htmlFor="discount">Discount (if applicable)</label>
            <input
              type="number"
              id="discount"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
            />
          </div>
          <div className="field">
            <label htmlFor="numberOfPages">Number of Pages</label>
            <input
              type="number"
              id="numberOfPages"
              name="numberOfPages"
              value={formData.numberOfPages}
              onChange={handleChange}
              
            />
          </div>
        </div>
        <div className="form-group">
          <div className="field">
            <label htmlFor="condition">Condition</label>
            <select
              id="condition"
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              
            >
              <option value="new">New</option>
              <option value="used">Used</option>
            </select>
          </div>
          {/* Empty div for alignment */}
          <div className="field"></div>
        </div>
        <div className="form-group">
          <div className="field full-width">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
            ></textarea>
          </div>
        </div>
        <button type="submit" className="submit-button">Add Book</button>
      </form>
    </div>
  );
};

export default BookForm;
