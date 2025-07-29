import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  AppBar,
  Toolbar,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { booksAPI } from '../services/api';
import { logout } from '../utils/auth';
import BookForm from '../components/BookForm';
import { Book, BooksResponse } from '../types';

const Dashboard: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const fetchBooks = async () => {
    try {
      const response = await booksAPI.getBooks();
      const data: BooksResponse = response.data;
      setBooks(data.books);
    } catch (error) {
      showSnackbar('Failed to fetch books', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleAddBook = () => {
    setFormMode('add');
    setSelectedBook(null);
    setFormOpen(true);
  };

  const handleEditBook = (book: Book) => {
    setFormMode('edit');
    setSelectedBook(book);
    setFormOpen(true);
  };

  const handleDeleteClick = (book: Book) => {
    setBookToDelete(book);
    setDeleteDialogOpen(true);
  };

  const handleSaveBook = async (bookData: Omit<Book, 'id'>) => {
    try {
      if (formMode === 'add') {
        await booksAPI.createBook(bookData);
        showSnackbar('Book added successfully', 'success');
      } else if (selectedBook) {
        await booksAPI.updateBook(selectedBook.id, bookData);
        showSnackbar('Book updated successfully', 'success');
      }
      fetchBooks();
    } catch (error) {
      showSnackbar(`Failed to ${formMode} book`, 'error');
    }
  };

  const handleDeleteBook = async () => {
    if (bookToDelete) {
      try {
        await booksAPI.deleteBook(bookToDelete.id);
        showSnackbar('Book deleted successfully', 'success');
        fetchBooks();
      } catch (error) {
        showSnackbar('Failed to delete book', 'error');
      }
    }
    setDeleteDialogOpen(false);
    setBookToDelete(null);
  };

  const handleLogout = () => {
    logout();
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Book Manager Dashboard
          </Typography>
          <Button
            color="inherit"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h4" component="h1">
            Books Collection
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddBook}
          >
            Add Book
          </Button>
        </Box>

        {books.length === 0 ? (
          <Box textAlign="center" py={4}>
            <Typography variant="h6" color="textSecondary">
              No books found. Add your first book!
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 3,
            }}
          >
            {books.map((book) => (
              <Card key={book.id}>
                <CardContent>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {book.title}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    by {book.author}
                  </Typography>
                  <Typography variant="body2">
                    Genre: {book.genre}
                  </Typography>
                  <Typography variant="body2">
                    Published: {book.yearPublished}
                  </Typography>
                </CardContent>
                <CardActions>
                  <IconButton
                    size="small"
                    onClick={() => handleEditBook(book)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteClick(book)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            ))}
          </Box>
        )}
      </Container>

      <BookForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSaveBook}
        book={selectedBook}
        mode={formMode}
      />

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{bookToDelete?.title}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteBook} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Dashboard;
