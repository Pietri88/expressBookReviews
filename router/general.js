const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
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
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
