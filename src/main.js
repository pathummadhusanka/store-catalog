import './style.css';

const STORAGE_KEY = 'qa-tasklab-products';
const CATEGORIES = ['Electronics', 'Home', 'Accessories', 'Office'];

const seedProducts = [
  {
    id: 'product-1',
    name: 'Aurora Wireless Headphones',
    description: 'Comfortable noise-cancelling headphones with all-day battery life.',
    category: 'Electronics',
    price: 129.99,
    stock: 18,
    featured: true,
    createdAt: '2026-10-01T09:00:00.000Z',
  },
  {
    id: 'product-2',
    name: 'Luma Desk Lamp',
    description: 'A compact LED desk lamp with adjustable brightness and warm light.',
    category: 'Office',
    price: 44.5,
    stock: 7,
    featured: true,
    createdAt: '2026-10-02T09:00:00.000Z',
  },
  {
    id: 'product-3',
    name: 'Terra Travel Mug',
    description: 'Leak-resistant stainless steel mug that keeps drinks hot for hours.',
    category: 'Accessories',
    price: 24.99,
    stock: 0,
    featured: false,
    createdAt: '2026-10-03T09:00:00.000Z',
  },
  {
    id: 'product-4',
    name: 'Cloud Throw Blanket',
    description: 'A soft, lightweight blanket for comfortable evenings at home.',
    category: 'Home',
    price: 69,
    stock: 12,
    featured: false,
    createdAt: '2026-10-04T09:00:00.000Z',
  },
];

function loadProducts() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedProducts));
    return [...seedProducts];
  }
  try {
    const products = JSON.parse(saved);
    return Array.isArray(products) ? products : [...seedProducts];
  } catch {
    return [...seedProducts];
  }
}

let products = loadProducts();
let activeCategory = 'All products';
let searchTerm = '';

function saveProducts() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function money(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

function formatDate(date) {
  if (!date) return 'Not available';
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(`${date}T00:00:00`));
}

function icon(name) {
  const icons = {
    store: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10v10h16V10M3 10l2-6h14l2 6M8 10v2a4 4 0 0 0 8 0v-2M9 4v6M15 4v6"/></svg>',
    plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
    search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 7l5 5-5 5"/></svg>',
    back: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
    edit: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4L19 9a2.1 2.1 0 0 0-4-4L4 16v4ZM13.5 6.5l4 4"/></svg>',
    trash: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M10 11v5M14 11v5M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>',
  };
  return icons[name];
}

function layout(content, active = 'catalog') {
  return `
    <div class="shell">
      <aside class="sidebar">
        <a class="brand" href="#/products" aria-label="Luma Market home">
          <span class="brand-mark">${icon('store')}</span>
          <span>Luma Market</span>
        </a>
        <nav aria-label="Main navigation">
          <a class="${active === 'catalog' ? 'active' : ''}" href="#/products"><span class="nav-icon">▦</span> Catalog</a>
        </nav>
        <div class="sidebar-footer"><span class="status-dot"></span> Store workspace<small>Products stay in your browser</small><button class="reset-demo" data-testid="reset-demo-button">Reset demo catalog</button></div>
      </aside>
      <main class="main-content">${content}</main>
    </div>
  `;
}

function stockLabel(stock) {
  if (stock === 0) return '<span class="stock out">Out of stock</span>';
  if (stock <= 5) return `<span class="stock low">${stock} left</span>`;
  return `<span class="stock available">${stock} in stock</span>`;
}

function productCard(product) {
  return `
    <article class="task-card product-card" data-testid="product-card" data-product-id="${escapeHtml(product.id)}">
      <div class="product-image ${product.category.toLowerCase()}">${product.category === 'Electronics' ? '◉' : product.category === 'Home' ? '⌂' : product.category === 'Office' ? '▤' : '◇'}</div>
      <div class="task-card-top"><span class="status-badge todo">${escapeHtml(product.category)}</span><button class="icon-button delete-product" data-id="${escapeHtml(product.id)}" aria-label="Delete ${escapeHtml(product.name)}">${icon('trash')}</button></div>
      <a class="task-title" href="#/products/${encodeURIComponent(product.id)}">${escapeHtml(product.name)}</a>
      <p>${escapeHtml(product.description)}</p>
      <div class="task-card-bottom"><strong class="product-price">${money(product.price)}</strong>${stockLabel(product.stock)}</div>
    </article>
  `;
}

function catalogPage() {
  const visibleProducts = products.filter((product) => {
    const categoryMatch = activeCategory === 'All products' || product.category === activeCategory;
    const query = searchTerm.toLowerCase();
    return categoryMatch && (!query || `${product.name} ${product.description} ${product.category}`.toLowerCase().includes(query));
  });
  const inStock = products.filter((product) => product.stock > 0).length;
  return layout(`
    <header class="page-header">
      <div><p class="eyebrow">Store catalog</p><h1>Discover something useful</h1><p class="subtitle">Browse products for every part of your day.</p></div>
      <a href="#/products/new" class="button primary" data-testid="add-product-button">${icon('plus')} Add product</a>
    </header>
    <section class="stats-grid" aria-label="Catalog summary">
      <div class="stat-card"><div class="stat-icon total">▦</div><div><span>Total products</span><strong>${products.length}</strong></div></div>
      <div class="stat-card"><div class="stat-icon done">✓</div><div><span>In stock</span><strong>${inStock}</strong></div></div>
      <div class="stat-card"><div class="stat-icon progress">$</div><div><span>Price range</span><strong>${products.length ? money(Math.min(...products.map((product) => product.price))) : '$0'}</strong></div></div>
      <div class="stat-card"><div class="stat-icon todo">!</div><div><span>Out of stock</span><strong>${products.filter((product) => product.stock === 0).length}</strong></div></div>
    </section>
    <section class="tasks-section">
      <div class="section-heading"><div><h2>All products</h2><p>Find the right product and view its details.</p></div><label class="search-box">${icon('search')}<span class="sr-only">Search products</span><input data-testid="product-search-input" type="search" placeholder="Search products..." value="${escapeHtml(searchTerm)}"></label></div>
      <div class="filter-tabs" role="tablist" aria-label="Filter products">
        ${['All products', ...CATEGORIES].map((category) => `<button class="${activeCategory === category ? 'selected' : ''}" data-category="${category}" role="tab" aria-selected="${activeCategory === category}">${category}${category === 'All products' ? ` <span>${products.length}</span>` : ''}</button>`).join('')}
      </div>
      <div class="task-grid">${visibleProducts.length ? visibleProducts.map(productCard).join('') : `<div class="empty-state"><div class="empty-icon">⌕</div><h3>No products found</h3><p>Try another search or add a new product.</p><a href="#/products/new" class="button secondary">${icon('plus')} Add product</a></div>`}</div>
    </section>
  `);
}

function formPage(product = null) {
  const editing = Boolean(product);
  return layout(`
    <div class="form-page"><a class="back-link" href="#/products">${icon('back')} Back to catalog</a>
      <div class="form-header"><p class="eyebrow">${editing ? 'Edit product' : 'New product'}</p><h1>${editing ? 'Update product details' : 'Add a new product'}</h1><p class="subtitle">${editing ? 'Keep product information and stock current.' : 'Add a product to the store catalog.'}</p></div>
      <form class="task-form" id="product-form" novalidate data-product-id="${product ? escapeHtml(product.id) : ''}">
        <div class="field full"><label for="name">Product name <span>*</span></label><input id="name" name="name" data-testid="product-name-input" required maxlength="80" value="${escapeHtml(product?.name)}" placeholder="e.g. Everyday Carry Backpack"><small class="field-error" data-error-for="name"></small></div>
        <div class="field full"><label for="description">Description <span>*</span></label><textarea id="description" name="description" rows="4" required maxlength="240" placeholder="Describe this product for shoppers.">${escapeHtml(product?.description)}</textarea><small class="field-error" data-error-for="description"></small></div>
        <div class="field"><label for="category">Category</label><select id="category" name="category">${CATEGORIES.map((category) => `<option ${product?.category === category ? 'selected' : ''}>${category}</option>`).join('')}</select></div>
        <div class="field"><label for="price">Price (USD) <span>*</span></label><input id="price" name="price" type="number" min="0.01" step="0.01" required value="${product?.price ?? ''}" placeholder="0.00"><small class="field-error" data-error-for="price"></small></div>
        <div class="field"><label for="stock">Stock quantity</label><input id="stock" name="stock" type="number" min="0" step="1" required value="${product?.stock ?? 0}"></div>
        <div class="field"><label for="featured">Featured product</label><select id="featured" name="featured"><option value="false" ${!product?.featured ? 'selected' : ''}>No</option><option value="true" ${product?.featured ? 'selected' : ''}>Yes</option></select></div>
        <div class="form-actions"><a href="#/products" class="button ghost">Cancel</a><button class="button primary" data-testid="save-product-button" type="submit">${editing ? 'Save changes' : 'Add product'}</button></div>
      </form>
    </div>
  `);
}

function detailPage(product) {
  if (!product) return layout(`<div class="empty-state standalone"><h3>Product not found</h3><p>This product may have been removed.</p><a href="#/products" class="button primary">Back to catalog</a></div>`);
  return layout(`
    <div class="detail-page"><a class="back-link" href="#/products">${icon('back')} Back to catalog</a>
      <div class="detail-header"><div><p class="eyebrow">Product details</p><h1>${escapeHtml(product.name)}</h1><div class="detail-meta"><span class="status-badge todo">${escapeHtml(product.category)}</span>${stockLabel(product.stock)}</div></div><div class="detail-actions"><a href="#/products/${encodeURIComponent(product.id)}/edit" class="button secondary">${icon('edit')} Edit product</a><button class="button danger-outline delete-product" data-id="${escapeHtml(product.id)}">${icon('trash')} Delete</button></div></div>
      <div class="detail-grid"><section class="detail-card"><h2>About this product</h2><p>${escapeHtml(product.description)}</p><dl><div><dt>Price</dt><dd>${money(product.price)}</dd></div><div><dt>Available stock</dt><dd>${product.stock} units</dd></div><div><dt>Added</dt><dd>${formatDate(product.createdAt.slice(0, 10))}</dd></div></dl></section><section class="detail-card"><h2>Shopping note</h2><p>${product.stock ? 'This product is currently available for purchase.' : 'This product is currently unavailable. Check back later.'}</p></section></div>
    </div>
  `);
}

function render() {
  const parts = location.hash.slice(2).split('/');
  const id = parts[1] ? decodeURIComponent(parts[1]) : null;
  const product = id ? products.find((item) => item.id === id) : null;
  const editing = parts[2] === 'edit';
  document.querySelector('#app').innerHTML = parts[0] !== 'products' || !id ? catalogPage() : id === 'new' ? formPage() : editing ? formPage(product) : detailPage(product);
  bindEvents();
}

function bindEvents() {
  document.querySelectorAll('[data-category]').forEach((button) => button.addEventListener('click', () => { activeCategory = button.dataset.category; render(); }));
  document.querySelector('[data-testid="product-search-input"]')?.addEventListener('input', (event) => {
    searchTerm = event.target.value;
    render();
    const input = document.querySelector('[data-testid="product-search-input"]');
    input.focus();
    input.setSelectionRange(searchTerm.length, searchTerm.length);
  });
  document.querySelector('#product-form')?.addEventListener('submit', handleFormSubmit);
  document.querySelector('[data-testid="reset-demo-button"]')?.addEventListener('click', () => {
    if (!window.confirm('Reset the catalog to the original demo products? Your current changes will be removed.')) return;
    products = seedProducts.map((product) => ({ ...product }));
    saveProducts();
    activeCategory = 'All products';
    searchTerm = '';
    location.hash = '#/products';
    render();
  });
  document.querySelectorAll('.delete-product').forEach((button) => button.addEventListener('click', () => {
    const product = products.find((item) => item.id === button.dataset.id);
    if (!product || !window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    products = products.filter((item) => item.id !== product.id);
    saveProducts();
    location.hash = '#/products';
    render();
  }));
}

function handleFormSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const name = String(data.get('name') || '').trim();
  const description = String(data.get('description') || '').trim();
  const price = Number(data.get('price'));
  const errors = { name: form.querySelector('[data-error-for="name"]'), description: form.querySelector('[data-error-for="description"]'), price: form.querySelector('[data-error-for="price"]') };
  Object.values(errors).forEach((error) => { error.textContent = ''; });
  if (!name) errors.name.textContent = 'Please enter a product name.';
  if (!description) errors.description.textContent = 'Please enter a product description.';
  if (!Number.isFinite(price) || price <= 0) errors.price.textContent = 'Enter a price greater than zero.';
  if (!name || !description || !Number.isFinite(price) || price <= 0) return;
  const productData = { name, description, category: String(data.get('category')), price: Number(price.toFixed(2)), stock: Math.max(0, Number.parseInt(data.get('stock'), 10) || 0), featured: data.get('featured') === 'true' };
  const existing = form.dataset.productId;
  if (existing) {
    products = products.map((product) => product.id === existing ? { ...product, ...productData } : product);
    location.hash = `#/products/${encodeURIComponent(existing)}`;
  } else {
    const newProduct = { ...productData, id: `product-${Date.now()}`, createdAt: new Date().toISOString() };
    products = [newProduct, ...products];
    location.hash = `#/products/${encodeURIComponent(newProduct.id)}`;
  }
  saveProducts();
  render();
}

window.addEventListener('hashchange', render);
if (!location.hash || !location.hash.startsWith('#/products')) location.hash = '#/products';
render();
