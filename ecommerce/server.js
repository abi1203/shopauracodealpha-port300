const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/cart', require('./routes/cart'));

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const LOCAL_MONGO_URI = 'mongodb://127.0.0.1:27017/codealpha_ecommerce';

async function connectToMongo() {
  const connectionUris = [
    process.env.MONGO_URI,
    LOCAL_MONGO_URI,
  ].filter(Boolean);

  let lastError;

  for (const uri of connectionUris) {
    try {
      await mongoose.connect(uri);
      console.log(`MongoDB Connected (${uri === LOCAL_MONGO_URI ? 'local' : 'configured'})`);

      const Product = require('./models/Product');
      await seedProducts(Product);
      return;
    } catch (err) {
      lastError = err;
      console.log(`MongoDB connection failed for ${uri === LOCAL_MONGO_URI ? 'local' : 'configured'} database:`, err.message);
    }
  }

  console.log('MongoDB Error:', lastError);
}

// Seed sample products
async function seedProducts(Product) {
  const count = await Product.countDocuments();
  if (count === 0) {
    await Product.insertMany([
      { name: 'Wireless Headphones', price: 2999, category: 'Electronics', description: 'Premium noise-cancelling wireless headphones with 30hr battery life.', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', stock: 50, rating: 4.5 },
      { name: 'Running Shoes', price: 1499, category: 'Fashion', description: 'Lightweight performance running shoes with cushioned sole.', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', stock: 30, rating: 4.3 },
      { name: 'Smart Watch', price: 4999, category: 'Electronics', description: 'Feature-rich smartwatch with health tracking and GPS.', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', stock: 20, rating: 4.7 },
      { name: 'Leather Backpack', price: 1999, category: 'Fashion', description: 'Genuine leather backpack with laptop compartment.', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', stock: 25, rating: 4.4 },
      { name: 'Desk Lamp', price: 799, category: 'Home', description: 'LED desk lamp with adjustable brightness and USB charging port.', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400', stock: 40, rating: 4.2 },
      { name: 'Coffee Maker', price: 3499, category: 'Home', description: 'Programmable 12-cup coffee maker with thermal carafe.', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400', stock: 15, rating: 4.6 },
      { name: 'Yoga Mat', price: 599, category: 'Sports', description: 'Non-slip eco-friendly yoga mat, 6mm thick.', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400', stock: 60, rating: 4.1 },
      { name: 'Sunglasses', price: 1299, category: 'Fashion', description: 'Polarized UV400 sunglasses with metal frame.', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400', stock: 35, rating: 4.5 },
    ]);
    console.log('Sample products seeded');
  }
}

const DEFAULT_PORT = 5000;
const PORT = Number(process.env.PORT) || DEFAULT_PORT;
const MAX_PORT_ATTEMPTS = 10;

function startServer(port, attemptsLeft = MAX_PORT_ATTEMPTS) {
  const server = app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE' && attemptsLeft > 1) {
      const nextPort = port + 1;
      console.log(`Port ${port} is busy. Trying fallback port ${nextPort}...`);
      startServer(nextPort, attemptsLeft - 1);
      return;
    }

    console.error('Server startup error:', err);
    process.exit(1);
  });
}

connectToMongo();
startServer(PORT);
