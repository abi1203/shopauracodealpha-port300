# 🛍️ ShopAura — E-Commerce Store
### CodeAlpha Internship Project — Task 1

---

## 🚀 Quick Setup

### Prerequisites
- Node.js (v16+) — https://nodejs.org
- MongoDB (local) — https://www.mongodb.com/try/download/community
  OR use MongoDB Atlas (free cloud) — https://www.mongodb.com/atlas

### Steps

**1. Install dependencies**
```bash
cd ecommerce
npm install
```

**2. Configure environment**
Open `.env` and update if needed:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/codealpha_ecommerce
JWT_SECRET=codealpha_secret_key_2024
```

For MongoDB Atlas, replace MONGO_URI with your Atlas connection string:
```
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/codealpha_ecommerce
```

**3. Start the server**
```bash
npm start
# OR for auto-reload during development:
npm run dev
```

**4. Open in browser**
```
http://localhost:5000
```

The app will **automatically seed 8 sample products** on first run!

---

## 📁 Project Structure

```
ecommerce/
├── server.js              ← Express server + MongoDB connection
├── .env                   ← Environment variables
├── package.json
│
├── models/
│   ├── User.js            ← User schema (auth)
│   ├── Product.js         ← Product schema
│   └── Order.js           ← Order schema
│
├── routes/
│   ├── auth.js            ← POST /register, POST /login, GET /profile
│   ├── products.js        ← GET /, GET /:id, POST /:id/review
│   ├── orders.js          ← POST /, GET /myorders, GET /:id
│   └── cart.js            ← POST /validate
│
├── middleware/
│   └── auth.js            ← JWT authentication middleware
│
└── public/                ← Frontend (HTML/CSS/JS)
    ├── index.html         ← Home / Product Listing
    ├── product.html       ← Product Detail Page
    ← cart.html           ← Shopping Cart + Checkout
    ← orders.html         ← My Orders
    ├── css/style.css      ← All styles
    └── js/app.js          ← Frontend logic
```

---

## ✅ Features Implemented

### Frontend
- 🏠 Home page with product grid
- 🔍 Search & filter by category
- ↕️ Sort by price / rating
- 📦 Product detail page with quantity selector
- 🛒 Shopping cart (localStorage)
- 💳 Checkout with shipping form
- 📋 My Orders page
- 🔐 Login / Register modal
- 📱 Responsive design

### Backend
- ✅ User registration & login with JWT
- ✅ Password hashing with bcrypt
- ✅ Product CRUD with filtering
- ✅ Order placement & history
- ✅ Stock management
- ✅ Product reviews & ratings
- ✅ Protected routes with middleware

---

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/profile | Get profile (auth required) |
| GET | /api/products | Get all products (filters supported) |
| GET | /api/products/:id | Get single product |
| POST | /api/products/:id/review | Add review (auth required) |
| POST | /api/orders | Place order (auth required) |
| GET | /api/orders/myorders | Get my orders (auth required) |
| GET | /api/orders/:id | Get order by ID (auth required) |

---

## 🎓 For CodeAlpha Submission

1. Push this project to GitHub in a repo named `CodeAlpha_ProjectName`
2. Record a video walkthrough showing all features
3. Share on LinkedIn tagging @CodeAlpha
4. Submit via the Submission Form

---

Built with ❤️ for CodeAlpha Full Stack Internship
