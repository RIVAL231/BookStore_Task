import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from '@mui/material';
import { Book } from '../types';

interface BookFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (book: Omit<Book, 'id'>) => void;
  book?: Book | null;
  mode: 'add' | 'edit';
}

const BookForm: React.FC<BookFormProps> = ({
  open,
  onClose,
  onSave,
  book,
  mode,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    yearPublished: new Date().getFullYear(),
  });

  useEffect(() => {
    if (book && mode === 'edit') {
      setFormData({
        title: book.title,
        author: book.author,
        genre: book.genre,
        yearPublished: book.yearPublished,
      });
    } else {
      setFormData({
        title: '',
        author: '',
        genre: '',
        yearPublished: new Date().getFullYear(),
      });
    }
  }, [book, mode, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'yearPublished' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {mode === 'add' ? 'Add New Book' : 'Edit Book'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              name="title"
              label="Title"
              value={formData.title}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              name="author"
              label="Author"
              value={formData.author}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              name="genre"
              label="Genre"
              value={formData.genre}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              name="yearPublished"
              label="Year Published"
              type="number"
              value={formData.yearPublished}
              onChange={handleChange}
              required
              fullWidth
              inputProps={{ min: 1000, max: new Date().getFullYear() }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {mode === 'add' ? 'Add Book' : 'Save Changes'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default BookForm;
