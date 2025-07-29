const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const booksRoutes = require('./routes/books');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', authRoutes);
app.use('/api', booksRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Book Manager API is running!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
