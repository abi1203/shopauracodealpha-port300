const express = require('express');
const router = express.Router();
// Cart is primarily handled client-side via localStorage
// This route provides product validation support
const Product = require('../models/Product');

router.post('/validate', async (req, res) => {
  try {
    const { items } = req.body;
    const validated = [];
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (product && product.stock >= item.quantity) {
        validated.push({ ...item, valid: true, currentPrice: product.price });
      } else {
        validated.push({ ...item, valid: false, reason: product ? 'Insufficient stock' : 'Product not found' });
      }
    }
    res.json(validated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
