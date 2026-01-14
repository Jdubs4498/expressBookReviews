const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

/**
 * Register a new user
 */
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

/**
 * Get all books
 */
public_users.get('/', (req, res) => {
  res.json(books);
});

/**
 * Get book by ISBN (Promise-based)
 */
public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  const getBookByISBN = (isbn) => {
    return new Promise((resolve, reject) => {
      const book = books[isbn];
      if (book) resolve(book);
      else reject("Book not found");
    });
  };

  getBookByISBN(isbn)
    .then(book => res.json(book))
    .catch(err => res.status(404).json({ error: err }));
});

/**
 * Get books by author
 */
public_users.get('/author/:author', (req, res) => {
  const author = req.params.author;

  const getBooksByAuthor = (author) => {
    return new Promise((resolve, reject) => {
      const filteredBooks = Object.values(books).filter(
        book => book.author === author
      );

      if (filteredBooks.length > 0) resolve(filteredBooks);
      else reject("No books found");
    });
  };

  getBooksByAuthor(author)
    .then(result => res.json(result))
    .catch(err => res.status(404).json({ error: err }));
});

/**
 * Get books by title
 */
public_users.get('/title/:title', (req, res) => {
  const title = req.params.title;

  const getBooksByTitle = (title) => {
    return new Promise((resolve, reject) => {
      const filteredBooks = Object.values(books).filter(
        book => book.title === title
      );

      if (filteredBooks.length > 0) resolve(filteredBooks);
      else reject("No books found");
    });
  };

  getBooksByTitle(title)
    .then(result => res.json(result))
    .catch(err => res.status(404).json({ error: err }));
});

/**
 * Get book reviews by ISBN
 */
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    res.json(books[isbn].reviews);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;