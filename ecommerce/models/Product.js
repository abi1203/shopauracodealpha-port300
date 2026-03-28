const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true, enum: ['Electronics', 'Fashion', 'Home', 'Sports', 'Books', 'Other'] },
  description: { type: String, required: true },
  image: { type: String, default: 'https://via.placeholder.com/400' },
  stock: { type: Number, default: 0 },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    rating: Number,
    comment: String,
    date: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
