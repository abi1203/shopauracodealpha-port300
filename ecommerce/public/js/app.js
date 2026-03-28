// ─── STATE ───────────────────────────────────────────────────
let currentCategory = 'All';
let searchTimeout = null;

// ─── INIT ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  updateAuthUI();
  if (document.getElementById('productsGrid')) loadProducts();
});

// ─── AUTH ─────────────────────────────────────────────────────
function updateAuthUI() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const btn = document.getElementById('authBtn');
  const greet = document.getElementById('userGreet');
  const ordersLink = document.getElementById('ordersLink');

  if (user) {
    if (btn) { btn.textContent = 'Logout'; btn.onclick = logout; }
    if (greet) greet.textContent = `Hi, ${user.name.split(' ')[0]}`;
    if (ordersLink) ordersLink.style.display = 'inline';
  } else {
    if (btn) { btn.textContent = 'Login'; btn.onclick = openAuth; }
    if (greet) greet.textContent = '';
    if (ordersLink) ordersLink.style.display = 'none';
  }
}

function openAuth() {
  document.getElementById('authModal').classList.add('active');
}
function closeAuth() {
  document.getElementById('authModal').classList.remove('active');
}
function switchTab(tab) {
  document.getElementById('loginForm').style.display = tab === 'login' ? 'block' : 'none';
  document.getElementById('registerForm').style.display = tab === 'register' ? 'block' : 'none';
  document.getElementById('loginTab').classList.toggle('active', tab === 'login');
  document.getElementById('registerTab').classList.toggle('active', tab === 'register');
}

async function login(e) {
  e.preventDefault();
  const msg = document.getElementById('loginMsg');
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: document.getElementById('loginEmail').value, password: document.getElementById('loginPass').value })
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('user', JSON.stringify(data));
      closeAuth();
      updateAuthUI();
      showToast(`Welcome back, ${data.name.split(' ')[0]}! 👋`);
    } else {
      msg.textContent = data.message;
      msg.style.color = '#e05c5c';
    }
  } catch (err) {
    msg.textContent = 'Connection error. Is the server running?';
    msg.style.color = '#e05c5c';
  }
}

async function register(e) {
  e.preventDefault();
  const msg = document.getElementById('regMsg');
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: document.getElementById('regName').value, email: document.getElementById('regEmail').value, password: document.getElementById('regPass').value })
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('user', JSON.stringify(data));
      closeAuth();
      updateAuthUI();
      showToast(`Account created! Welcome, ${data.name.split(' ')[0]}! 🎉`);
    } else {
      msg.textContent = data.message;
      msg.style.color = '#e05c5c';
    }
  } catch (err) {
    msg.textContent = 'Connection error. Is the server running?';
    msg.style.color = '#e05c5c';
  }
}

function logout() {
  localStorage.removeItem('user');
  updateAuthUI();
  showToast('Logged out successfully');
  if (window.location.pathname === '/orders.html') window.location.href = '/';
}

// ─── PRODUCTS ─────────────────────────────────────────────────
async function loadProducts() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  const search = document.getElementById('searchInput')?.value || '';
  const sort = document.getElementById('sortSelect')?.value || '';
  grid.innerHTML = '<div class="loading-spinner">Loading products...</div>';
  try {
    const params = new URLSearchParams();
    if (currentCategory !== 'All') params.set('category', currentCategory);
    if (search) params.set('search', search);
    if (sort) params.set('sort', sort);
    const res = await fetch(`/api/products?${params}`);
    const products = await res.json();
    if (!products.length) {
      grid.innerHTML = '<div class="loading-spinner">No products found.</div>';
      return;
    }
    grid.innerHTML = products.map(p => {
      const stars = '★'.repeat(Math.round(p.rating || 0)) + '☆'.repeat(5 - Math.round(p.rating || 0));
      return `
        <div class="product-card" onclick="window.location.href='/product.html?id=${p._id}'">
          <div class="pc-img-wrap">
            <img src="${p.image}" alt="${p.name}" loading="lazy" />
            <span class="pc-category">${p.category}</span>
          </div>
          <div class="pc-body">
            <p class="pc-name">${p.name}</p>
            <p class="pc-rating">${stars} <span style="color:var(--text2);font-size:.8rem">(${p.rating?.toFixed(1) || '0.0'})</span></p>
            <div class="pc-footer">
              <span class="pc-price">₹${p.price.toLocaleString()}</span>
              <button class="pc-cart-btn" onclick="event.stopPropagation(); addToCart('${p._id}', '${p.name.replace(/'/g,"\\'")}', ${p.price}, '${p.image}')">+ Cart</button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  } catch (err) {
    grid.innerHTML = '<div class="loading-spinner">Failed to load products. Is the server running?</div>';
  }
}

function filterCat(cat, btn) {
  currentCategory = cat;
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  loadProducts();
}

function searchProducts() {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(loadProducts, 350);
}

// ─── CART ─────────────────────────────────────────────────────
function addToCart(id, name, price, image) {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const idx = cart.findIndex(i => i.product === id);
  if (idx > -1) cart[idx].quantity += 1;
  else cart.push({ product: id, name, price, image, quantity: 1 });
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartBadge();
  showToast(`${name} added to cart 🛒`);
}

function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const total = cart.reduce((s, i) => s + i.quantity, 0);
  document.querySelectorAll('#cartBadge').forEach(el => el.textContent = total);
}

// ─── TOAST ────────────────────────────────────────────────────
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

// Close modal on overlay click
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('active');
  }
});
