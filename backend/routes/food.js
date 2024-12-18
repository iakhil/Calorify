const express = require('express');
const router = express.Router();
const Food = require('../models/Food');

// Save Food Entry
router.post('/', async (req, res) => {
  const { food_name, calories, quantity } = req.body;

  if (!food_name || !calories || !quantity) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const foodEntry = new Food({ food_name, calories, quantity });
    const savedFood = await foodEntry.save();
    res.status(201).json({ message: 'Food saved successfully', data: savedFood });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Export router
module.exports = router;
