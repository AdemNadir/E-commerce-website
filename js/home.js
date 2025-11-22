// Home Page JavaScript

// DOM Elements
const featuredProductsContainer = document.getElementById('featured-products');
const filterButtons = document.querySelectorAll('.filter-btn');
const storeMap = document.getElementById('store-map');
const newsletterForm = document.getElementById('newsletter-form');

// Sample product data - in a real implementation, this would be fetched from the server
const products = [
  {
    id: 1,
    name: 'Classic White T-Shirt',
    category: 'clothing',
    price: 29.99,
    originalPrice: null,
    rating: 4.5,
    reviewCount: 24,
    image: 'https://images.pexels.com/photos/4066288/pexels-photo-4066288.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    isNew: true
  },
  {
    id: 2,
    name: 'Leather Crossbody Bag',
    category: 'accessories',
    price: 79.99,
    originalPrice: 99.99,
    rating: 4.8,
    reviewCount: 36,
    image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    isNew: false
  },
  {
    id: 3,
    name: 'Premium Denim Jeans',
    category: 'clothing',
    price: 59.99,
    originalPrice: null,
    rating: 4.2,
    reviewCount: 18,
    image: 'https://images.pexels.com/photos/1082529/pexels-photo-1082529.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    isNew: false
  },
  {
    id: 4,
    name: 'Minimalist Watch',
    category: 'accessories',
    price: 119.99,
    originalPrice: 149.99,
    rating: 4.7,
    reviewCount: 42,
    image: 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    isNew: false
  },
  {
    id: 5,
    name: 'Casual Sneakers',
    category: 'footwear',
    price: 89.99,
    originalPrice: null,
    rating: 4.6,
    reviewCount: 31,
    image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    isNew: true
  },
  {
    id: 6,
    name: 'Wool Blend Blazer',
    category: 'clothing',
    price: 129.99,
    originalPrice: 169.99,
    rating: 4.3,
    reviewCount: 15,
    image: 'https://images.pexels.com/photos/3760613/pexels-photo-3760613.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    isNew: false
  },
  {
    id: 7,
    name: 'Aviator Sunglasses',
    category: 'accessories',
    price: 49.99,
    originalPrice: null,
    rating: 4.4,
    reviewCount: 28,
    image: 'https://images.pexels.com/photos/46710/pexels-photo-46710.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    isNew: false
  },
  {
    id: 8,
    name: 'Ankle Boots',
    category: 'footwear',
    price: 99.99,
    originalPrice: 129.99,
    rating: 4.1,
    reviewCount: 22,
    image: 'https://images.pexels.com/photos/718981/pexels-photo-718981.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    isNew: false
  }
];

// Load featured products
function loadFeaturedProducts(category = 'all') {
  if (!featuredProductsContainer) return;

  // Show loading spinner
  featuredProductsContainer.innerHTML = '<div class="loading-spinner"></div>';

  // Simulate loading delay
  setTimeout(() => {
    let filteredProducts = products;
    
    if (category !== 'all') {
      filteredProducts = products.filter(product => product.category === category);
    }

    // Generate products HTML
    const productsHTML = filteredProducts.map(product => createProductCard(product)).join('');
    
    featuredProductsContainer.innerHTML = productsHTML;

    // Add event listeners to the newly created add-to-cart buttons
    const addToCartButtons = featuredProductsContainer.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const productId = button.dataset.productId;
        const product = products.find(p => p.id === parseInt(productId));
        if (product) {
          cart.addItem(product);
        }
      });
    });
  }, 500);
}

// Filter Products by Category
if (filterButtons) {
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const category = button.dataset.category;
      
      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Load filtered products
      loadFeaturedProducts(category);
    });
  });
}

// Initialize Google Maps (in a real implementation, this would use the actual Google Maps API)
function initMap() {
  if (!storeMap) return;

  // Display a placeholder map image for demonstration
  storeMap.innerHTML = `
    <img src="https://via.placeholder.com/600x400?text=Store+Location+Map" alt="Store Location Map" style="width: 100%; height: 100%; object-fit: cover;">
  `;
}

// Handle newsletter form submission
if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = document.getElementById('newsletter-email');
    const email = emailInput.value.trim();
    
    if (email) {
      // In a real implementation, this would send the email to the server
      // For now, just show a success message
      const formContainer = newsletterForm.parentElement;
      formContainer.innerHTML = `
        <div class="alert alert-success">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          <p>Thank you for subscribing to our newsletter!</p>
        </div>
      `;
    }
  });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
  loadFeaturedProducts();
  initMap();
});