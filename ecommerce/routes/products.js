const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

// Get all products
router.get('/', async (req, res) => {
  try {
    const { category, search, sort } = req.query;
    let query = {};
    if (category && category !== 'All') query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };
    let products = Product.find(query);
    if (sort === 'price_asc') products = products.sort({ price: 1 });
    else if (sort === 'price_desc') products = products.sort({ price: -1 });
    else if (sort === 'rating') products = products.sort({ rating: -1 });
    else products = products.sort({ createdAt: -1 });
    res.json(await products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add review
router.post('/:id/review', protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const { rating, comment } = req.body;
    product.reviews.push({ user: req.user._id, name: req.user.name, rating, comment });
    product.rating = product.reviews.reduce((a, r) => a + r.rating, 0) / product.reviews.length;
    await product.save();
    res.status(201).json({ message: 'Review added' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
