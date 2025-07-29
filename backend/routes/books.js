const express = require('express');
const { v4: uuidv4 } = require('uuid');
const authenticateToken = require('../authMiddleware');
const { books } = require('../data/books');

const router = express.Router();

// GET /books - Get all books (protected)
router.get('/books', authenticateToken, (req, res) => {
  res.json({
    message: 'Books retrieved successfully',
    books: books
  });
});

// POST /books - Create a new book (protected)
router.post('/books', authenticateToken, (req, res) => {
  const { title, author, genre, yearPublished } = req.body;

  // Validate required fields
  if (!title || !author || !genre || !yearPublished) {
    return res.status(400).json({
      message: 'All fields are required: title, author, genre, yearPublished'
    });
  }

  // Create new book
  const newBook = {
    id: uuidv4(),
    title,
    author,
    genre,
    yearPublished: parseInt(yearPublished)
  };

  books.push(newBook);

  res.status(201).json({
    message: 'Book created successfully',
    book: newBook
  });
});

// PUT /books/:id - Update an existing book (protected)
router.put('/books/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { title, author, genre, yearPublished } = req.body;

  // Find book by ID
  const bookIndex = books.findIndex(book => book.id === id);

  if (bookIndex === -1) {
    return res.status(404).json({ message: 'Book not found' });
  }

  // Validate required fields
  if (!title || !author || !genre || !yearPublished) {
    return res.status(400).json({
      message: 'All fields are required: title, author, genre, yearPublished'
    });
  }

  // Update book
  books[bookIndex] = {
    id,
    title,
    author,
    genre,
    yearPublished: parseInt(yearPublished)
  };

  res.json({
    message: 'Book updated successfully',
    book: books[bookIndex]
  });
});

// DELETE /books/:id - Delete a book (protected)
router.delete('/books/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  // Find book by ID
  const bookIndex = books.findIndex(book => book.id === id);

  if (bookIndex === -1) {
    return res.status(404).json({ message: 'Book not found' });
  }

  // Remove book from array
  const deletedBook = books.splice(bookIndex, 1)[0];

  res.json({
    message: 'Book deleted successfully',
    book: deletedBook
  });
});

module.exports = router;
