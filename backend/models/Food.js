const mongoose = require('mongoose');

const FoodSchema = new mongoose.Schema({
  food_name: { type: String, required: true },
  calories: { type: Number, required: true },
  quantity: { type: Number, required: true },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Food', FoodSchema);
