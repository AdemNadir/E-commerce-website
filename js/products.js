// Products Page JavaScript

// DOM Elements
const productsGrid = document.getElementById('products-grid');
const paginationNumbers = document.getElementById('pagination-numbers');
const productsTotal = document.getElementById('products-total');
const minPriceInput = document.getElementById('min-price');
const maxPriceInput = document.getElementById('max-price');
const minPriceSlider = document.getElementById('min-price-slider');
const maxPriceSlider = document.getElementById('max-price-slider');
const sliderTrack = document.querySelector('.slider-track');
const sortBySelect = document.getElementById('sort-by');
const viewButtons = document.querySelectorAll('.view-option');
const applyFiltersBtn = document.getElementById('apply-filters');
const clearFiltersBtn = document.getElementById('clear-filters');
const categoryCheckboxes = document.querySelectorAll('input[name="category"]');
const colorCheckboxes = document.querySelectorAll('input[name="color"]');
const sizeCheckboxes = document.querySelectorAll('input[name="size"]');

// Sample product data - in a real implementation, this would be fetched from the server
const allProducts = [
  {
    id: 1,
    name: 'Classic White T-Shirt',
    category: 'clothing',
    color: 'white',
    sizes: ['xs', 's', 'm', 'l', 'xl'],
    price: 29.99,
    originalPrice: null,
    rating: 4.5,
    reviewCount: 24,
    image: 'https://images.pexels.com/photos/4066288/pexels-photo-4066288.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    isNew: true,
    description: 'A timeless white t-shirt made from premium cotton. Perfect for everyday wear.'
  },
  {
    id: 2,
    name: 'Leather Crossbody Bag',
    category: 'accessories',
    color: 'black',
    sizes: [],
    price: 79.99,
    originalPrice: 99.99,
    rating: 4.8,
    reviewCount: 36,
    image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    isNew: false,
    description: 'A stylish leather crossbody bag with multiple compartments. Perfect for daily use.'
  },
  {
    id: 3,
    name: 'Premium Denim Jeans',
    category: 'clothing',
    color: 'blue',
    sizes: ['s', 'm', 'l', 'xl'],
    price: 59.99,
    originalPrice: null,
    rating: 4.2,
    reviewCount: 18,
    image: 'https://images.pexels.com/photos/1082529/pexels-photo-1082529.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    isNew: false,
    description: 'High-quality denim jeans with a modern fit. Made from sustainable materials.'
  },
  {
    id: 4,
    name: 'Minimalist Watch',
    category: 'accessories',
    color: 'black',
    sizes: [],
    price: 119.99,
    originalPrice: 149.99,
    rating: 4.7,
    reviewCount: 42,
    image: 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    isNew: false,
    description: 'A sleek, minimalist watch with a leather strap. Suitable for both casual and formal occasions.'
  },
  {
    id: 5,
    name: 'Casual Sneakers',
    category: 'footwear',
    color: 'white',
    sizes: ['7', '8', '9', '10', '11'],
    price: 89.99,
    originalPrice: null,
    rating: 4.6,
    reviewCount: 31,
    image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    isNew: true,
    description: 'Comfortable casual sneakers with cushioned insoles. Perfect for everyday wear.'
  },
  {
    id: 6,
    name: 'Wool Blend Blazer',
    category: 'clothing',
    color: 'black',
    sizes: ['s', 'm', 'l', 'xl'],
    price: 129.99,
    originalPrice: 169.99,
    rating: 4.3,
    reviewCount: 15,
    image: 'https://images.pexels.com/photos/3760613/pexels-photo-3760613.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    isNew: false,
    description: 'A sophisticated wool blend blazer. Perfect for formal occasions or business attire.'
  },
  {
    id: 7,
    name: 'Aviator Sunglasses',
    category: 'accessories',
    color: 'yellow',
    sizes: [],
    price: 49.99,
    originalPrice: null,
    rating: 4.4,
    reviewCount: 28,
    image: 'https://images.pexels.com/photos/46710/pexels-photo-46710.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    isNew: false,
    description: 'Classic aviator sunglasses with UV protection. Stylish and functional.'
  },
  {
    id: 8,
    name: 'Ankle Boots',
    category: 'footwear',
    color: 'black',
    sizes: ['6', '7', '8', '9', '10'],
    price: 99.99,
    originalPrice: 129.99,
    rating: 4.1,
    reviewCount: 22,
    image: 'https://images.pexels.com/photos/718981/pexels-photo-718981.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    isNew: false,
    description: 'Stylish ankle boots with a low heel. Perfect for fall and winter wear.'
  },
  {
    id: 9,
    name: 'Silk Scarf',
    category: 'accessories',
    color: 'red',
    sizes: [],
    price: 39.99,
    originalPrice: null,
    rating: 4.9,
    reviewCount: 19,
    image: 'https://images.pexels.com/photos/1078973/pexels-photo-1078973.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    isNew: false,
    description: 'A luxurious silk scarf with a beautiful pattern. Adds elegance to any outfit.'
  },
  {
    id: 10,
    name: 'Formal Dress Shoes',
    category: 'footwear',
    color: 'black',
    sizes: ['7', '8', '9', '10', '11'],
    price: 149.99,
    originalPrice: 179.99,
    rating: 4.5,
    reviewCount: 27,
    image: 'https://images.pexels.com/photos/267301/pexels-photo-267301.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    isNew: false,
    description: 'Elegant formal dress shoes made from genuine leather. Perfect for formal occasions.'
  },
  {
    id: 11,
    name: 'Graphic Print T-Shirt',
    category: 'clothing',
    color: 'black',
    sizes: ['s', 'm', 'l', 'xl'],
    price: 34.99,
    originalPrice: null,
    rating: 4.2,
    reviewCount: 14,
    image: 'https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    isNew: true,
    description: 'A trendy graphic print t-shirt made from soft cotton. Express your unique style.'
  },
  {
    id: 12,
    name: 'Leather Wallet',
    category: 'accessories',
    color: 'black',
    sizes: [],
    price: 44.99,
    originalPrice: 59.99,
    rating: 4.7,
    reviewCount: 33,
    image: 'https://images.pexels.com/photos/669996/pexels-photo-669996.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    isNew: false,
    description: 'A genuine leather wallet with multiple card slots and a coin pocket. Slim and functional design.'
  }
];

// Pagination settings
const productsPerPage = 8;
let currentPage = 1;
let filteredProducts = [];

// Initialize price slider
function initPriceSlider() {
  if (!minPriceSlider || !maxPriceSlider) return;

  // Set initial slider positions
  updateSliderTrack();

  // Update min price input when slider changes
  minPriceSlider.addEventListener('input', () => {
    if (parseInt(minPriceSlider.value) >= parseInt(maxPriceSlider.value)) {
      minPriceSlider.value = parseInt(maxPriceSlider.value) - 10;
    }
    minPriceInput.value = minPriceSlider.value;
    updateSliderTrack();
  });

  // Update max price input when slider changes
  maxPriceSlider.addEventListener('input', () => {
    if (parseInt(maxPriceSlider.value) <= parseInt(minPriceSlider.value)) {
      maxPriceSlider.value = parseInt(minPriceSlider.value) + 10;
    }
    maxPriceInput.value = maxPriceSlider.value;
    updateSliderTrack();
  });

  // Update slider when input changes
  minPriceInput.addEventListener('change', () => {
    let value = parseInt(minPriceInput.value);
    if (isNaN(value)) value = 0;
    if (value < 0) value = 0;
    if (value > parseInt(maxPriceInput.value) - 10) value = parseInt(maxPriceInput.value) - 10;
    minPriceInput.value = value;
    minPriceSlider.value = value;
    updateSliderTrack();
  });

  maxPriceInput.addEventListener('change', () => {
    let value = parseInt(maxPriceInput.value);
    if (isNaN(value)) value = 1000;
    if (value > 1000) value = 1000;
    if (value < parseInt(minPriceInput.value) + 10) value = parseInt(minPriceInput.value) + 10;
    maxPriceInput.value = value;
    maxPriceSlider.value = value;
    updateSliderTrack();
  });
}

// Update slider track position
function updateSliderTrack() {
  if (!sliderTrack || !minPriceSlider || !maxPriceSlider) return;
  
  const minVal = parseInt(minPriceSlider.value);
  const maxVal = parseInt(maxPriceSlider.value);
  const minPercent = (minVal / parseInt(minPriceSlider.max)) * 100;
  const maxPercent = (maxVal / parseInt(maxPriceSlider.max)) * 100;
  
  sliderTrack.style.left = minPercent + '%';
  sliderTrack.style.width = (maxPercent - minPercent) + '%';
}

// Switch between grid and list view
if (viewButtons) {
  viewButtons.forEach(button => {
    button.addEventListener('click', () => {
      const view = button.dataset.view;
      
      // Update active button
      viewButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Update view
      if (productsGrid) {
        if (view === 'list') {
          productsGrid.classList.add('list-view');
        } else {
          productsGrid.classList.remove('list-view');
        }
      }
    });
  });
}

// Filter products based on selected filters
function filterProducts() {
  let filtered = [...allProducts];
  
  // Filter by search query (if any)
  const urlParams = getUrlParams();
  if (urlParams.search) {
    const searchTerm = urlParams.search.toLowerCase();
    filtered = filtered.filter(product => 
      product.name.toLowerCase().includes(searchTerm) || 
      product.category.toLowerCase().includes(searchTerm)
    );
  }
  
  // Filter by category
  const selectedCategories = Array.from(categoryCheckboxes)
    .filter(checkbox => checkbox.checked && checkbox.value !== 'all')
    .map(checkbox => checkbox.value);
  
  if (selectedCategories.length > 0) {
    filtered = filtered.filter(product => selectedCategories.includes(product.category));
  }
  
  // Filter by price range
  const minPrice = parseInt(minPriceInput?.value || 0);
  const maxPrice = parseInt(maxPriceInput?.value || 1000);
  filtered = filtered.filter(product => product.price >= minPrice && product.price <= maxPrice);
  
  // Filter by color
  const selectedColors = Array.from(colorCheckboxes)
    .filter(checkbox => checkbox.checked)
    .map(checkbox => checkbox.value);
  
  if (selectedColors.length > 0) {
    filtered = filtered.filter(product => selectedColors.includes(product.color));
  }
  
  // Filter by size
  const selectedSizes = Array.from(sizeCheckboxes)
    .filter(checkbox => checkbox.checked)
    .map(checkbox => checkbox.value);
  
  if (selectedSizes.length > 0) {
    filtered = filtered.filter(product => {
      // If product has sizes, check if any selected size is available
      if (product.sizes.length > 0) {
        return product.sizes.some(size => selectedSizes.includes(size));
      }
      return true; // Include products without sizes (e.g., accessories)
    });
  }
  
  // Sort products
  const sortBy = sortBySelect?.value || 'featured';
  switch (sortBy) {
    case 'price-low':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      filtered.sort((a, b) => b.price - a.price);
      break;
    case 'newest':
      filtered.sort((a, b) => b.isNew - a.isNew);
      break;
    case 'best-selling':
      filtered.sort((a, b) => b.reviewCount - a.reviewCount);
      break;
    default:
      // Featured sorting (default) - no specific sort
      break;
  }
  
  return filtered;
}

// Load products with pagination
function loadProducts() {
  if (!productsGrid) return;

  // Show loading spinner
  productsGrid.innerHTML = '<div class="loading-spinner"></div>';

  // Get filtered products
  filteredProducts = filterProducts();
  
  // Update products count
  if (productsTotal) {
    productsTotal.textContent = filteredProducts.length;
  }
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  if (currentPage > totalPages) {
    currentPage = totalPages > 0 ? totalPages : 1;
  }
  
  // Get products for current page
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Simulate loading delay
  setTimeout(() => {
    // Generate products HTML
    let productsHTML = '';
    
    if (currentProducts.length === 0) {
      productsHTML = `
        <div class="no-products">
          <p>No products found matching your criteria.</p>
          <button id="reset-filters" class="btn btn-primary">Reset Filters</button>
        </div>
      `;
    } else {
      productsHTML = currentProducts.map(product => {
        const card = createProductCard(product);
        
        // For list view, add product description
        if (productsGrid.classList.contains('list-view')) {
          const cardWithDescription = card.replace(
            '<div class="product-price">',
            `<div class="product-description">${product.description}</div><div class="product-price">`
          );
          return cardWithDescription;
        }
        
        return card;
      }).join('');
    }
    
    productsGrid.innerHTML = productsHTML;
    
    // Add event listener to reset filters button
    const resetFiltersBtn = document.getElementById('reset-filters');
    if (resetFiltersBtn) {
      resetFiltersBtn.addEventListener('click', resetFilters);
    }
    
    // Update pagination
    updatePagination(totalPages);

    // Add event listeners to the newly created add-to-cart buttons
    const addToCartButtons = productsGrid.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const productId = button.dataset.productId;
        const product = allProducts.find(p => p.id === parseInt(productId));
        if (product) {
          cart.addItem(product);
        }
      });
    });
  }, 500);
}

// Update pagination controls
function updatePagination(totalPages) {
  if (!paginationNumbers) return;
  
  // Generate pagination numbers
  let paginationHTML = '';
  
  if (totalPages <= 5) {
    // Show all pages
    for (let i = 1; i <= totalPages; i++) {
      paginationHTML += `
        <button class="pagination-number ${i === currentPage ? 'active' : ''}" data-page="${i}">
          ${i}
        </button>
      `;
    }
  } else {
    // Show first page, current page and neighbors, and last page
    paginationHTML += `<button class="pagination-number ${currentPage === 1 ? 'active' : ''}" data-page="1">1</button>`;
    
    if (currentPage > 3) {
      paginationHTML += `<span class="pagination-ellipsis">...</span>`;
    }
    
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(currentPage + 1, totalPages - 1); i++) {
      paginationHTML += `
        <button class="pagination-number ${i === currentPage ? 'active' : ''}" data-page="${i}">
          ${i}
        </button>
      `;
    }
    
    if (currentPage < totalPages - 2) {
      paginationHTML += `<span class="pagination-ellipsis">...</span>`;
    }
    
    paginationHTML += `
      <button class="pagination-number ${currentPage === totalPages ? 'active' : ''}" data-page="${totalPages}">
        ${totalPages}
      </button>
    `;
  }
  
  paginationNumbers.innerHTML = paginationHTML;
  
  // Add event listeners to pagination buttons
  const paginationButtons = paginationNumbers.querySelectorAll('.pagination-number');
  paginationButtons.forEach(button => {
    button.addEventListener('click', () => {
      currentPage = parseInt(button.dataset.page);
      loadProducts();
      window.scrollTo(0, 0);
    });
  });
  
  // Update prev/next buttons
  const prevButton = document.querySelector('.pagination-prev');
  const nextButton = document.querySelector('.pagination-next');
  
  if (prevButton) {
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        loadProducts();
        window.scrollTo(0, 0);
      }
    });
  }
  
  if (nextButton) {
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => {
      if (currentPage < totalPages) {
        currentPage++;
        loadProducts();
        window.scrollTo(0, 0);
      }
    });
  }
}

// Reset all filters
function resetFilters() {
  // Reset category checkboxes
  if (categoryCheckboxes) {
    categoryCheckboxes.forEach(checkbox => {
      checkbox.checked = checkbox.value === 'all';
    });
  }
  
  // Reset price range
  if (minPriceInput && maxPriceInput && minPriceSlider && maxPriceSlider) {
    minPriceInput.value = 0;
    maxPriceInput.value = 1000;
    minPriceSlider.value = 0;
    maxPriceSlider.value = 1000;
    updateSliderTrack();
  }
  
  // Reset color checkboxes
  if (colorCheckboxes) {
    colorCheckboxes.forEach(checkbox => {
      checkbox.checked = false;
    });
  }
  
  // Reset size checkboxes
  if (sizeCheckboxes) {
    sizeCheckboxes.forEach(checkbox => {
      checkbox.checked = false;
    });
  }
  
  // Reset sort
  if (sortBySelect) {
    sortBySelect.value = 'featured';
  }
  
  // Reset page
  currentPage = 1;
  
  // Reload products
  loadProducts();
}

// Handle filter application
if (applyFiltersBtn) {
  applyFiltersBtn.addEventListener('click', () => {
    currentPage = 1; // Reset to first page when filters change
    loadProducts();
  });
}

// Handle filter reset
if (clearFiltersBtn) {
  clearFiltersBtn.addEventListener('click', resetFilters);
}

// Handle sort change
if (sortBySelect) {
  sortBySelect.addEventListener('change', () => {
    loadProducts();
  });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
  initPriceSlider();
  
  // Check URL parameters for category filters
  const urlParams = getUrlParams();
  if (urlParams.category && categoryCheckboxes) {
    const categoryParam = urlParams.category;
    categoryCheckboxes.forEach(checkbox => {
      if (checkbox.value === 'all') {
        checkbox.checked = false;
      }
      if (checkbox.value === categoryParam) {
        checkbox.checked = true;
      }
    });
  }
  
  loadProducts();
});