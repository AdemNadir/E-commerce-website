// Main JavaScript for all pages

// DOM Elements
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const mainNav = document.querySelector('.main-nav');
const searchToggle = document.querySelector('.search-toggle');
const searchContainer = document.querySelector('.search-container');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const cartCount = document.querySelector('.cart-count');

// Mobile Menu Toggle
if (mobileMenuToggle && mainNav) {
  mobileMenuToggle.addEventListener('click', () => {
    mainNav.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');
  });
}

// Search Toggle
if (searchToggle && searchContainer) {
  searchToggle.addEventListener('click', () => {
    searchContainer.style.display = searchContainer.style.display === 'block' ? 'none' : 'block';
    if (searchContainer.style.display === 'block') {
      searchInput.focus();
    }
  });

  // Close search when clicking outside
  document.addEventListener('click', (e) => {
    if (!searchToggle.contains(e.target) && !searchContainer.contains(e.target)) {
      searchContainer.style.display = 'none';
    }
  });
}

// Search Form Submission
if (searchForm) {
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
      window.location.href = `products.html?search=${encodeURIComponent(searchTerm)}`;
    }
  });
}

// Cart functionality
class Cart {
  constructor() {
    this.items = [];
    this.loadCart();
    this.updateCartCount();
  }

  loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        this.items = JSON.parse(savedCart);
      } catch (e) {
        console.error('Error loading cart:', e);
        this.items = [];
      }
    }
  }

  saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.items));
    this.updateCartCount();
  }

  updateCartCount() {
    if (cartCount) {
      const itemCount = this.items.reduce((total, item) => total + item.quantity, 0);
      cartCount.textContent = itemCount;
    }
  }

  addItem(product, quantity = 1, selectedOptions = {}) {
    const existingItemIndex = this.items.findIndex(item => 
      item.id === product.id && 
      JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions)
    );

    if (existingItemIndex !== -1) {
      this.items[existingItemIndex].quantity += quantity;
    } else {
      this.items.push({
        ...product,
        quantity,
        selectedOptions
      });
    }

    this.saveCart();
    return this.showAddedToCartNotification(product.name);
  }

  updateItem(index, quantity) {
    if (index >= 0 && index < this.items.length) {
      if (quantity <= 0) {
        this.removeItem(index);
      } else {
        this.items[index].quantity = quantity;
        this.saveCart();
      }
    }
  }

  removeItem(index) {
    if (index >= 0 && index < this.items.length) {
      this.items.splice(index, 1);
      this.saveCart();
    }
  }

  clearCart() {
    this.items = [];
    this.saveCart();
  }

  getTotal() {
    return this.items.reduce((total, item) => {
      const price = item.salePrice || item.price;
      return total + (price * item.quantity);
    }, 0);
  }

  showAddedToCartNotification(productName) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
      <div class="cart-notification-content">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        <div>
          <p><strong>${productName}</strong> has been added to your cart.</p>
          <div class="cart-notification-actions">
            <a href="cart.html" class="btn btn-primary btn-sm">View Cart</a>
            <button class="btn btn-outline btn-sm continue-shopping">Continue Shopping</button>
          </div>
        </div>
        <button class="cart-notification-close">×</button>
      </div>
    `;

    document.body.appendChild(notification);

    // Style the notification
    const style = document.createElement('style');
    style.textContent = `
      .cart-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        max-width: 350px;
        background-color: white;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        border-radius: 6px;
        z-index: 1000;
        overflow: hidden;
        animation: slideIn 0.3s forwards;
      }
      .cart-notification-content {
        display: flex;
        padding: 16px;
        gap: 12px;
      }
      .cart-notification .icon {
        color: var(--success);
        flex-shrink: 0;
      }
      .cart-notification p {
        margin-bottom: 12px;
      }
      .cart-notification-actions {
        display: flex;
        gap: 8px;
      }
      .cart-notification-close {
        position: absolute;
        top: 8px;
        right: 8px;
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
        color: var(--gray-500);
      }
      .btn-sm {
        padding: 6px 12px;
        font-size: 14px;
      }
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
    `;
    document.head.appendChild(style);

    // Add event listeners
    const closeNotification = () => {
      notification.style.animation = 'slideOut 0.3s forwards';
      setTimeout(() => notification.remove(), 300);
    };

    notification.querySelector('.cart-notification-close').addEventListener('click', closeNotification);
    notification.querySelector('.continue-shopping').addEventListener('click', closeNotification);

    // Auto-close after 5 seconds
    setTimeout(closeNotification, 5000);

    return true;
  }
}

// Initialize cart
const cart = new Cart();

// Function to format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

// Function to create product card HTML
function createProductCard(product) {
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
  const badge = product.isNew ? '<span class="product-badge badge-new">New</span>' :
                discount > 0 ? `<span class="product-badge badge-sale">-${discount}%</span>` : '';

  return `
    <div class="product-card">
      <div class="product-image">
        <a href="product.html?id=${product.id}">
          <img src="${product.image}" alt="${product.name}">
        </a>
        ${badge}
        <div class="product-actions">
          <a href="product.html?id=${product.id}" class="product-action-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </a>
          <button class="product-action-btn add-to-cart-btn" data-product-id="${product.id}">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
          </button>
          <button class="product-action-btn wishlist-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path></svg>
          </button>
        </div>
      </div>
      <div class="product-info">
        <div class="product-category">${product.category}</div>
        <h3 class="product-name"><a href="product.html?id=${product.id}">${product.name}</a></h3>
        <div class="product-rating">
          <div class="stars">
            ${getStarRating(product.rating)}
          </div>
          <span class="rating-count">(${product.reviewCount})</span>
        </div>
        <div class="product-price">
          <span class="current-price">${formatCurrency(product.price)}</span>
          ${product.originalPrice ? `<span class="original-price">${formatCurrency(product.originalPrice)}</span>` : ''}
        </div>
      </div>
    </div>
  `;
}

// Function to generate star rating HTML
function getStarRating(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  
  let stars = '';
  for (let i = 0; i < fullStars; i++) {
    stars += '<span class="star">★</span>';
  }
  if (halfStar) {
    stars += '<span class="star">★</span>';
  }
  for (let i = 0; i < emptyStars; i++) {
    stars += '<span class="star">☆</span>';
  }
  
  return stars;
}

// Function to get URL parameters
function getUrlParams() {
  const params = {};
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  
  for (const [key, value] of urlParams.entries()) {
    params[key] = value;
  }
  
  return params;
}

// Attach event listeners for add-to-cart buttons (handled by event delegation)
document.addEventListener('click', (e) => {
  const addToCartBtn = e.target.closest('.add-to-cart-btn');
  if (addToCartBtn) {
    const productId = addToCartBtn.dataset.productId;
    if (productId) {
      // In a real implementation, you would fetch the product data
      // For now, we'll just show a notification
      const dummyProduct = {
        id: productId,
        name: 'Product',
        price: 29.99,
        quantity: 1
      };
      cart.addItem(dummyProduct);
    }
  }
});