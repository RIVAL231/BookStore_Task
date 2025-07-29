const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Hardcoded users as per requirements
const users = [
  { username: "admin", password: "admin123" },
  { username: "user1", password: "user123" }
];

// JWT Secret (in production, this should be an environment variable)
const JWT_SECRET = 'your-secret-key-here';

// POST /login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  // Find user
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Generate JWT token
  const token = jwt.sign(
    { username: user.username },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    message: 'Login successful',
    token,
    user: { username: user.username }
  });
});

module.exports = router;
