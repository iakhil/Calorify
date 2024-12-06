const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import CORS
const authRoutes = require('./routes/auth');
require('dotenv').config();

const app = express();
const PORT = 4000;

// Middleware
app.use(bodyParser.json());

// Enable CORS
app.use(cors({
  origin: ['http://localhost:8081', 'http://192.168.1.67:8081'], // Replace with the frontend's address
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  credentials: true, // If you're using cookies or authentication headers
}));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

// Routes
app.use('/api/auth', authRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
