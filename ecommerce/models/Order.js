const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    image: String,
    price: Number,
    quantity: Number
  }],
  shippingAddress: {
    name: String,
    street: String,
    city: String,
    state: String,
    pincode: String,
    phone: String
  },
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, default: 'COD' },
  paymentStatus: { type: String, default: 'Pending', enum: ['Pending', 'Paid', 'Failed'] },
  orderStatus: { type: String, default: 'Processing', enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
