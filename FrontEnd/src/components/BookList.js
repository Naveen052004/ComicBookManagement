import React, { useEffect, useState } from 'react';
import './BookList.css';
import EditBook from './EditBook';
import Modal from './Modal';
import BookForm from './BookForm';

const BookList = () => {
    const [books, setBooks] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [filters, setFilters] = useState({});
    const [sort, setSort] = useState({ field: 'bookName', order: 'asc' });
    const [editingBookId, setEditingBookId] = useState(null);
    const [editList,setEditList] = useState(null);
    const [addingBook,setAddingBook] = useState(null);


    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const fetchBooks = async () => {
        try {
            const query = new URLSearchParams({ page, limit: 10, ...filters, sort: sort.field, order: sort.order }).toString();
            console.log(query);
            const response = await fetch(`http://localhost:5000/books?${query}`);
            const data = await response.json();
            setBooks(data.books);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Error fetching books:', error);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        fetchBooks();
    }, [page, filters, sort]);

    const handleDelete = async (id) => {
        try {
            await fetch(`http://localhost:5000/api/booksDelete/${id}`, {
                method: 'DELETE',
            });
            setBooks(books.filter(book => book._id !== id));
        } catch (error) {
            console.error('Error deleting book:', error);
        }
    };

    const handleEdit = (id,book) => {
        setEditingBookId(id);
        setEditList({...book});
        // console.log("BookList lo ", editList);
    };

    const closeEditForm = () => {
        setEditingBookId(null);
        setEditList(null);
    };
    const closeAddForm = () =>{
        setAddingBook(null);
        refreshBooks();
    };
    const refreshBooks = () => {
        fetchBooks();
    };

    const handleNextPage = () => {
        if (page < totalPages) {
            setPage((prev) => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (page > 1) {
            setPage((prev) => prev - 1);
        }
    };

    const styles = {
        filterContainer: {
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '20px',
        },
        input: {
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            width: '150px',
        },
        select: {
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
        },
        addButton: {
            backgroundColor: 'green',
            color: 'white',
            padding: '10px 15px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            float: 'right',
        },
    };

    return (
        <div className="book-list">
            <div>
                <h2 style={{ display: 'inline-block' }}>Book List</h2>
                <button style={styles.addButton} onClick={() => setAddingBook(true)}>Add Book</button>
            </div>

            <div style={styles.filterContainer}>
                <input type="text" name="authorName" placeholder="Author" onChange={handleFilterChange} style={styles.input} />
                <input type="number" name="yearOfPublication" placeholder="Year" onChange={handleFilterChange} style={styles.input} />
                <input type="number" name="price" placeholder="Max Price" onChange={handleFilterChange} style={styles.input} />
                <select name="condition" onChange={handleFilterChange} style={styles.select}>
                    <option value="">All Conditions</option>
                    <option value="new">New</option>
                    <option value="used">Used</option>
                </select>
                <select onChange={(e) => setSort({ field: e.target.value, order: sort.order })} style={styles.select}>
                    <option value="bookName">Sort by Title</option>
                    <option value="yearOfPublication">Sort by Year</option>
                    <option value="price">Sort by Price</option>
                </select>
                <select onChange={(e) => setSort({ field: sort.field, order: e.target.value })} style={styles.select}>
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                </select>
            </div>
            <div className="pagination">
                <button onClick={handlePrevPage} disabled={page === 1}>Previous</button>
                <span>Page {page} of {totalPages}</span>
                <button onClick={handleNextPage} disabled={page === totalPages}>Next</button>
            </div>
            {books.length === 0 ? (
                <p>No books available</p>
            ) : (
                <ul>
                    {books.map((book) => (
                        <li key={book._id}>
                            <h3>{book.bookName}</h3>
                            <p>Author: {book.authorName}</p>
                            <p>Year: {book.yearOfPublication}</p>
                            <p>Price: ${book.price}</p>
                            <p>Condition: {book.condition}</p>
                            <p>{book.description}</p>
                            <div className="button-group">
                                <button className="edit-button" onClick={() => handleEdit(book._id,book)}>Edit</button>
                                <button className="delete-button" onClick={() => handleDelete(book._id)}>Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <div className="pagination">
                <button onClick={handlePrevPage} disabled={page === 1}>Previous</button>
                <span>Page {page} of {totalPages}</span>
                <button onClick={handleNextPage} disabled={page === totalPages}>Next</button>
            </div>

            <Modal isOpen={editingBookId || addingBook} onClose={editingBookId?closeEditForm:closeAddForm}>
                {editingBookId && (
                    <EditBook
                        bookId={editingBookId}
                        onClose={closeEditForm}
                        onUpdate={refreshBooks}
                        data = {editList}
                    />
                )}
                { addingBook && <BookForm onClose={closeAddForm} ></BookForm>}
            </Modal>
        </div>
    );
};

export default BookList;
