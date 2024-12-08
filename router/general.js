const express = require('express');
let books = require("./booksdb.js");  // Przykładowa baza książek
const { isAuthenticated } = require('./auth_users.js');  // Importujemy middleware do autoryzacji

const general = express.Router();

// Pobieranie listy książek
general.get('/books', (req, res) => {
    return res.status(200).json({
        message: "Books retrieved successfully",
        books: books
    });
});

// Pobieranie książki po ISBN
general.get('/books/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).json({
            message: "Book details retrieved successfully",
            book: books[isbn]
        });
    } else {
        return res.status(404).json({
            message: `Book with ISBN ${isbn} not found`
        });
    }
});

// Dodawanie lub aktualizowanie recenzji książki - wymaga bycia zalogowanym
general.put('/books/:isbn/review', isAuthenticated, (req, res) => {
    const { isbn } = req.params;
    const { review } = req.body;
    const username = req.username;  // Odczytujemy username z tokenu

    if (!review) {
        return res.status(400).json({
            message: "Review text is required"
        });
    }

    if (!books[isbn]) {
        return res.status(404).json({
            message: `Book with ISBN ${isbn} not found`
        });
    }

    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }

    // Dodawanie recenzji lub aktualizacja istniejącej
    books[isbn].reviews[username] = review;

    return res.status(200).json({
        message: `Review for book with ISBN ${isbn} added/updated successfully`,
        review: books[isbn].reviews[username]
    });
});

module.exports = general;
