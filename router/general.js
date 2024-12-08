const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const { username, password } = req.body;  // Destructure the username and password from the request body

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({
            message: "Both 'username' and 'password' are required"
        });
    }

    // Check if the username already exists
    if (users[username]) {
        return res.status(400).json({
            message: `Username '${username}' already exists`
        });
    }

    // Add the new user to the users object (you can hash the password in a real-world application)
    users[username] = {
        username: username,
        password: password  // In a real application, ensure the password is hashed
    };

    // Respond with a success message
    return res.status(201).json({
        message: `User '${username}' registered successfully`
    });
});

// Get the list of books available in the shop
public_users.get('/', function (req, res) {
    try {
        // Check if the books database exists and is not empty
        if (Object.keys(books).length === 0) {
            return res.status(404).json({ message: "No books available in the database" });
        }

        // Return the list of books
        return res.status(200).json({
            message: "Books retrieved successfully",
            books: books
        });
    } catch (err) {
        // Handle server error
        return res.status(500).json({ message: "Server error", error: err.message });
    }
});


// Get book details based on ISBN
public_users.get('/isbn/:id', function (req, res) {
    const id = req.params.id;

    // Check if the book with the given ISBN exists
    if (books[id]) {
        return res.status(200).json({
            message: "Book details retrieved successfully",
            book: books[id]
        });
    } else {
        return res.status(404).json({
            message: `Book with ISBN ${id} not found`
        });
    }
});
  
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    let foundBooks = [];

    // Iterate through the books object
    for (let key in books) {
        if (books[key].author.toLowerCase() === author.toLowerCase()) {
            foundBooks.push(books[key]);
        }
    }

    // If any books by the author are found, return them
    if (foundBooks.length > 0) {
        return res.status(200).json({
            message: `Books by ${author} retrieved successfully`,
            books: foundBooks
        });
    } else {
        return res.status(404).json({
            message: `No books found by author ${author}`
        });
    }
});

public_users.get('/title/:title', function (req, res) {
    const title = req.params.title.toLowerCase();  // Make the title case-insensitive
    let foundBooks = [];

    // Iterate through the books object
    for (let key in books) {
        if (books[key].title.toLowerCase().includes(title)) {
            foundBooks.push(books[key]);
        }
    }

    // If any books with the given title are found, return them
    if (foundBooks.length > 0) {
        return res.status(200).json({
            message: `Books with title containing "${title}" retrieved successfully`,
            books: foundBooks
        });
    } else {
        return res.status(404).json({
            message: `No books found with the title "${title}"`
        });
    }
});

// Get book review based on book ID (not ISBN)
public_users.get('/review/:id', function (req, res) {
    const id = req.params.id;  // Extract book ID from request parameters
    
    // Check if the book with the given ID exists
    if (books[id]) {
        const book = books[id];
        const reviews = book.reviews;

        // If there are reviews for the book, return them
        if (Object.keys(reviews).length > 0) {
            return res.status(200).json({
                message: `Reviews for the book with ID ${id} retrieved successfully`,
                reviews: reviews
            });
        } else {
            return res.status(404).json({
                message: `No reviews found for the book with ID ${id}`
            });
        }
    } else {
        return res.status(404).json({
            message: `Book with ID ${id} not found`
        });
    }
});


module.exports.general = public_users;
