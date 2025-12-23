// Product Page JavaScript

// DOM Elements
const productName = document.getElementById('product-name');
const productPrice = document.getElementById('product-price');
const productOriginalPrice = document.getElementById('product-original-price');
const productDescription = document.getElementById('product-description');
const mainProductImage = document.getElementById('main-product-image');
const productThumbnails = document.getElementById('product-thumbnails');
const colorOptions = document.getElementById('color-options');
const sizeOptions = document.getElementById('size-options');
const selectedColor = document.getElementById('selected-color');
const selectedSize = document.getElementById('selected-size');
const productQuantity = document.getElementById('product-quantity');
const decreaseQuantity = document.getElementById('decrease-quantity');
const increaseQuantity = document.getElementById('increase-quantity');
const addToCartBtn = document.getElementById('add-to-cart');
const productSku = document.getElementById('product-sku');
const productCategory = document.getElementById('product-category');
const productTags = document.getElementById('product-tags');
const fullDescription = document.getElementById('full-description');
const productDetailsTable = document.getElementById('product-details-table');
const tabButtons = document.querySelectorAll('.tab-btn');
const relatedProductsContainer = document.getElementById('related-products');
const productBreadcrumb = document.getElementById('product-breadcrumb');

// Sample product data - in a real implementation, this would be fetched from the server
const products = [
  {
    id: 1,
    name: 'Classic White T-Shirt',
    category: 'Clothing',
    colors: [
      { name: 'White', code: '#FFFFFF', image: 'https://images.pexels.com/photos/4066288/pexels-photo-4066288.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
      { name: 'Black', code: '#000000', image: 'https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
      { name: 'Navy', code: '#1C2841', image: 'https://images.pexels.com/photos/1496647/pexels-photo-1496647.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    price: 29.99,
    originalPrice: null,
    rating: 4.5,
    reviewCount: 24,
    images: [
      'https://images.pexels.com/photos/4066288/pexels-photo-4066288.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/4066285/pexels-photo-4066285.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/4066293/pexels-photo-4066293.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/4066287/pexels-photo-4066287.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
    ],
    isNew: true,
    sku: 'TS-WH-001',
    tags: ['t-shirt', 'casual', 'essential'],
    shortDescription: 'A timeless white t-shirt made from premium cotton. Perfect for everyday wear.',
    fullDescription: `<p>This classic white t-shirt is a wardrobe essential that combines comfort, style, and versatility. Crafted from 100% premium combed cotton with a weight of 180 GSM, it offers superior softness and durability for all-day comfort.</p>
    <p>The relaxed fit ensures freedom of movement while maintaining a flattering silhouette. The ribbed crew neckline provides a clean, classic look that works well on its own or layered under other pieces.</p>
    <h3>Features:</h3>
    <ul>
      <li>100% premium combed cotton (180 GSM)</li>
      <li>Relaxed fit for comfort and style</li>
      <li>Ribbed crew neckline</li>
      <li>Reinforced shoulder seams for added durability</li>
      <li>Tagless collar for itch-free comfort</li>
      <li>Pre-shrunk fabric to maintain size and shape</li>
    </ul>
    <p>Whether you're dressing it up with a blazer or keeping it casual with jeans, this versatile t-shirt is designed to be a foundation piece in your wardrobe.</p>
    <p>Care instructions: Machine wash cold with similar colors. Tumble dry low. Do not bleach.</p>`,
    details: {
      'Material': '100% Premium Combed Cotton, 180 GSM',
      'Fit': 'Relaxed',
      'Neckline': 'Crew Neck',
      'Care Instructions': 'Machine wash cold, tumble dry low, do not bleach',
      'Country of Origin': 'Made in Portugal',
      'Model Info': 'Model is 6\'1" and wears size M'
    },
    relatedProducts: [2, 3, 6, 11]
  },
  {
    id: 2,
    name: 'Leather Crossbody Bag',
    category: 'Accessories',
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
    category: 'Clothing',
    price: 59.99,
    originalPrice: null,
    rating: 4.2,
    reviewCount: 18,
    image: 'https://images.pexels.com/photos/1082529/pexels-photo-1082529.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    isNew: false
  },
  {
    id: 6,
    name: 'Wool Blend Blazer',
    category: 'Clothing',
    price: 129.99,
    originalPrice: 169.99,
    rating: 4.3,
    reviewCount: 15,
    image: 'https://images.pexels.com/photos/3760613/pexels-photo-3760613.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    isNew: false
  },
  {
    id: 11,
    name: 'Graphic Print T-Shirt',
    category: 'Clothing',
    price: 34.99,
    originalPrice: null,
    rating: 4.2,
    reviewCount: 14,
    image: 'https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    isNew: true
  }
];

// Load product details based on URL parameter
function loadProductDetails() {
  const urlParams = getUrlParams();
  const productId = parseInt(urlParams.id) || 1; // Default to first product if no ID provided
  
  const product = products.find(p => p.id === productId);
  if (!product) return;
  
  // Update page title
  document.title = `${product.name} - Elegance`;
  
  // Update product name and breadcrumb
  if (productName) productName.textContent = product.name;
  if (productBreadcrumb) productBreadcrumb.textContent = product.name;
  
  // Update prices
  if (productPrice) productPrice.textContent = formatCurrency(product.price);
  if (productOriginalPrice) {
    if (product.originalPrice) {
      productOriginalPrice.textContent = formatCurrency(product.originalPrice);
      productOriginalPrice.style.display = 'inline';
    } else {
      productOriginalPrice.style.display = 'none';
    }
  }
  
  // Update description
  if (productDescription) productDescription.textContent = product.shortDescription || '';
  
  // Update main image
  if (mainProductImage && product.images && product.images.length > 0) {
    mainProductImage.src = product.images[0];
    mainProductImage.alt = product.name;
    
    // Initialize image zoom
    initImageZoom();
  }
  
  // Update thumbnails
  if (productThumbnails && product.images && product.images.length > 0) {
    const thumbnailsHTML = product.images.map((image, index) => `
      <div class="thumbnail ${index === 0 ? 'active' : ''}" data-index="${index}">
        <img src="${image}" alt="${product.name} - Image ${index + 1}">
      </div>
    `).join('');
    
    productThumbnails.innerHTML = thumbnailsHTML;
    
    // Add event listeners to thumbnails
    const thumbnails = productThumbnails.querySelectorAll('.thumbnail');
    thumbnails.forEach(thumbnail => {
      thumbnail.addEventListener('click', () => {
        const index = parseInt(thumbnail.dataset.index);
        mainProductImage.src = product.images[index];
        
        // Update active thumbnail
        thumbnails.forEach(t => t.classList.remove('active'));
        thumbnail.classList.add('active');
        
        // Reinitialize image zoom
        initImageZoom();
      });
    });
  }
  
  // Update color options
  if (colorOptions && product.colors && product.colors.length > 0) {
    const colorsHTML = product.colors.map((color, index) => `
      <div class="color-option ${index === 0 ? 'active' : ''}" 
           style="background-color: ${color.code};" 
           data-color="${color.name}"
           data-image="${color.image}">
      </div>
    `).join('');
    
    colorOptions.innerHTML = colorsHTML;
    
    // Set initial selected color
    if (selectedColor) selectedColor.textContent = product.colors[0].name;
    
    // Add event listeners to color options
    const colors = colorOptions.querySelectorAll('.color-option');
    colors.forEach(color => {
      color.addEventListener('click', () => {
        // Update active color
        colors.forEach(c => c.classList.remove('active'));
        color.classList.add('active');
        
        // Update selected color text
        if (selectedColor) selectedColor.textContent = color.dataset.color;
        
        // Update main image if color has an associated image
        if (color.dataset.image && mainProductImage) {
          mainProductImage.src = color.dataset.image;
          
          // Reinitialize image zoom
          initImageZoom();
        }
      });
    });
  }
  
  // Update size options
  if (sizeOptions && product.sizes && product.sizes.length > 0) {
    const sizesHTML = product.sizes.map((size, index) => `
      <div class="size-option ${index === 0 ? 'active' : ''}" data-size="${size}">
        ${size}
      </div>
    `).join('');
    
    sizeOptions.innerHTML = sizesHTML;
    
    // Set initial selected size
    if (selectedSize) selectedSize.textContent = product.sizes[0];
    
    // Add event listeners to size options
    const sizes = sizeOptions.querySelectorAll('.size-option');
    sizes.forEach(size => {
      size.addEventListener('click', () => {
        // Update active size
        sizes.forEach(s => s.classList.remove('active'));
        size.classList.add('active');
        
        // Update selected size text
        if (selectedSize) selectedSize.textContent = size.dataset.size;
      });
    });
  }
  
  // Initialize quantity controls
  if (productQuantity && decreaseQuantity && increaseQuantity) {
    decreaseQuantity.addEventListener('click', () => {
      let quantity = parseInt(productQuantity.value);
      if (quantity > 1) {
        productQuantity.value = quantity - 1;
      }
    });
    
    increaseQuantity.addEventListener('click', () => {
      let quantity = parseInt(productQuantity.value);
      productQuantity.value = quantity + 1;
    });
    
    productQuantity.addEventListener('change', () => {
      let quantity = parseInt(productQuantity.value);
      if (isNaN(quantity) || quantity < 1) {
        productQuantity.value = 1;
      }
    });
  }
  
  // Add to cart functionality
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
      const quantity = parseInt(productQuantity?.value || 1);
      
      // Get selected options
      const selectedColorOption = colorOptions?.querySelector('.color-option.active');
      const selectedSizeOption = sizeOptions?.querySelector('.size-option.active');
      
      const selectedOptions = {
        color: selectedColorOption?.dataset.color || null,
        size: selectedSizeOption?.dataset.size || null
      };
      
      // Add product to cart
      cart.addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        salePrice: product.originalPrice ? product.price : null, // If there's an original price, the current price is a sale price
        image: mainProductImage?.src || product.images?.[0] || '',
        category: product.category
      }, quantity, selectedOptions);
    });
  }
  
  // Update product metadata
  if (productSku) productSku.textContent = product.sku || '';
  if (productCategory) productCategory.textContent = product.category || '';
  if (productTags) productTags.textContent = product.tags?.join(', ') || '';
  
  // Update full description
  if (fullDescription && product.fullDescription) {
    fullDescription.innerHTML = product.fullDescription;
  }
  
  // Update product details table
  if (productDetailsTable && product.details) {
    const detailsHTML = Object.entries(product.details).map(([key, value]) => `
      <tr>
        <th>${key}</th>
        <td>${value}</td>
      </tr>
    `).join('');
    
    productDetailsTable.innerHTML = detailsHTML;
  }
  
  // Load related products
  loadRelatedProducts(product.relatedProducts || []);
}

// Initialize image zoom functionality
function initImageZoom() {
  const mainImage = document.getElementById('main-product-image');
  const zoomLens = document.querySelector('.image-zoom-lens');
  const zoomResult = document.querySelector('.image-zoom-result');
  
  if (!mainImage || !zoomLens || !zoomResult) return;
  
  let zoomActive = false;
  
  // Calculate zoom result background position
  function calculateZoomPosition(e) {
    // Get cursor position
    const rect = mainImage.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate position percentage
    const xPercent = x / rect.width * 100;
    const yPercent = y / rect.height * 100;
    
    // Position zoom lens
    const lensWidth = zoomLens.offsetWidth;
    const lensHeight = zoomLens.offsetHeight;
    zoomLens.style.left = `${x - lensWidth / 2}px`;
    zoomLens.style.top = `${y - lensHeight / 2}px`;
    
    // Position zoom result background
    zoomResult.style.backgroundImage = `url(${mainImage.src})`;
    zoomResult.style.backgroundSize = `${mainImage.width * 2}px ${mainImage.height * 2}px`;
    zoomResult.style.backgroundPosition = `${-xPercent * 2}% ${-yPercent * 2}%`;
  }
  
  // Handle mouse events
  mainImage.addEventListener('mouseenter', () => {
    zoomActive = true;
    zoomLens.style.display = 'block';
    zoomResult.style.display = 'block';
  });
  
  mainImage.addEventListener('mouseleave', () => {
    zoomActive = false;
    zoomLens.style.display = 'none';
    zoomResult.style.display = 'none';
  });
  
  mainImage.addEventListener('mousemove', (e) => {
    if (zoomActive) {
      calculateZoomPosition(e);
    }
  });
}

// Handle tab switching
if (tabButtons) {
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabId = button.dataset.tab;
      
      // Update active tab button
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Update active tab content
      const tabPanes = document.querySelectorAll('.tab-pane');
      tabPanes.forEach(pane => pane.classList.remove('active'));
      document.getElementById(tabId)?.classList.add('active');
    });
  });
}

// Load related products
function loadRelatedProducts(relatedProductIds) {
  if (!relatedProductsContainer || !relatedProductIds.length) return;
  
  // Filter products to get related products
  const related = products.filter(product => relatedProductIds.includes(product.id));
  
  // Generate HTML for related products
  const relatedHTML = related.map(product => createProductCard(product)).join('');
  
  relatedProductsContainer.innerHTML = relatedHTML;
  
  // Add event listeners to the newly created add-to-cart buttons
  const addToCartButtons = relatedProductsContainer.querySelectorAll('.add-to-cart-btn');
  addToCartButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const productId = button.dataset.productId;
      const product = products.find(p => p.id === parseInt(productId));
      if (product) {
        cart.addItem(product);
      }
    });
  });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
  loadProductDetails();
});