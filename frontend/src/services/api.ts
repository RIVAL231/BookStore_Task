import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle authentication errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: (credentials: { username: string; password: string }) =>
    api.post('/login', credentials),
};

// Books API calls
export const booksAPI = {
  getBooks: () => api.get('/books'),
  createBook: (book: {
    title: string;
    author: string;
    genre: string;
    yearPublished: number;
  }) => api.post('/books', book),
  updateBook: (
    id: string,
    book: {
      title: string;
      author: string;
      genre: string;
      yearPublished: number;
    }
  ) => api.put(`/books/${id}`, book),
  deleteBook: (id: string) => api.delete(`/books/${id}`),
};

export default api;
