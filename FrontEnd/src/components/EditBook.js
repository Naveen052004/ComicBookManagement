import React, { useEffect, useState } from 'react';

const EditBook = ({ bookId, onClose, onUpdate, data }) => {
    const [bookData, setBookData] = useState({...data});
    // console.log(bookData);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBookData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await fetch(`http://localhost:5000/api/booksUpdate/${bookId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookData),
            });
            onUpdate(); // Refresh the list after update
            onClose(); // Close the edit form
        } catch (error) {
            console.error('Error updating book:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="edit-book-form">
            <h2>Edit Book</h2>
            <input type="text" name="bookName" value={bookData.bookName} onChange={handleChange} placeholder="Book Name" required />
            <input type="text" name="authorName" value={bookData.authorName} onChange={handleChange} placeholder="Author Name" required />
            <input type="number" name="yearOfPublication" value={bookData.yearOfPublication} onChange={handleChange} placeholder="Year of Publication" required />
            <input type="number" name="price" value={bookData.price} onChange={handleChange} placeholder="Price" required />
            <select name="condition" value={bookData.condition} onChange={handleChange}>
                <option value="new">New</option>
                <option value="used">Used</option>
            </select>
            <textarea name="description" value={bookData.description} onChange={handleChange} placeholder="Description"></textarea>
            <div>
                <button type="submit">Update Book</button>
                <button type="button" className="cancel" onClick={onClose}>Cancel</button>
            </div>
        </form>
    );
};

export default EditBook;
