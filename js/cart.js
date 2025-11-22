// Cart Page JavaScript

// DOM Elements
const cartItemsBody = document.getElementById('cart-items-body');
const cartEmpty = document.getElementById('cart-empty');
const cartContent = document.getElementById('cart-content');
const cartSubtotal = document.getElementById('cart-subtotal');
const cartDiscount = document.getElementById('cart-discount');
const cartShipping = document.getElementById('cart-shipping');
const cartTotal = document.getElementById('cart-total');
const clearCartBtn = document.getElementById('clear-cart');
const updateCartBtn = document.getElementById('update-cart');
const applyCouponBtn = document.getElementById('apply-coupon');
const couponCodeInput = document.getElementById('coupon-code');
const recommendedProductsContainer = document.getElementById('recommended-products');

// Sample recommended products data
const recommendedProducts = [
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
    id: 9,
    name: 'Silk Scarf',
    category: 'accessories',
    price: 39.99,
    originalPrice: null,
    rating: 4.9,
    reviewCount: 19,
    image: 'https://images.pexels.com/photos/1078973/pexels-photo-1078973.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    isNew: false
  }
];

// Cart state
let discountAmount = 0;
let discountCode = '';
const shippingThreshold = 50; // Free shipping for orders over $50
const standardShipping = 5.99;

// Load cart items
function loadCartItems() {
  if (!cartItemsBody || !cartEmpty || !cartContent) return;
  
  const cartItems = cart.items;
  
  // Show empty cart message if cart is empty
  if (cartItems.length === 0) {
    cartEmpty.classList.remove('hidden');
    cartContent.classList.add('hidden');
    return;
  }
  
  // Show cart content
  cartEmpty.classList.add('hidden');
  cartContent.classList.remove('hidden');
  
  // Generate cart items HTML
  const cartItemsHTML = cartItems.map((item, index) => {
    const itemTotal = item.quantity * (item.salePrice || item.price);
    const colorInfo = item.selectedOptions?.color ? `<div class="cart-item-color">Color: ${item.selectedOptions.color}</div>` : '';
    const sizeInfo = item.selectedOptions?.size ? `<div class="cart-item-size">Size: ${item.selectedOptions.size}</div>` : '';
    
    return `
      <tr>
        <td>
          <div class="cart-item-product">
            <div class="cart-item-image">
              <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
              <h3><a href="product.html?id=${item.id}">${item.name}</a></h3>
              <div class="cart-item-meta">
                ${colorInfo}
                ${sizeInfo}
              </div>
            </div>
          </div>
        </td>
        <td class="cart-item-price">${formatCurrency(item.salePrice || item.price)}</td>
        <td>
          <div class="cart-item-quantity">
            <button class="cart-quantity-btn decrease-btn" data-index="${index}">−</button>
            <input type="number" class="cart-quantity-input" value="${item.quantity}" min="1" max="99" data-index="${index}">
            <button class="cart-quantity-btn increase-btn" data-index="${index}">+</button>
          </div>
        </td>
        <td class="cart-item-subtotal">${formatCurrency(itemTotal)}</td>
        <td>
          <button class="cart-item-remove" data-index="${index}">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
          </button>
        </td>
      </tr>
    `;
  }).join('');
  
  cartItemsBody.innerHTML = cartItemsHTML;
  
  // Add event listeners to quantity buttons
  const decreaseButtons = cartItemsBody.querySelectorAll('.decrease-btn');
  const increaseButtons = cartItemsBody.querySelectorAll('.increase-btn');
  const quantityInputs = cartItemsBody.querySelectorAll('.cart-quantity-input');
  const removeButtons = cartItemsBody.querySelectorAll('.cart-item-remove');
  
  decreaseButtons.forEach(button => {
    button.addEventListener('click', () => {
      const index = parseInt(button.dataset.index);
      const input = quantityInputs[index];
      let quantity = parseInt(input.value);
      
      if (quantity > 1) {
        input.value = --quantity;
        updateCartItemQuantity(index, quantity);
      }
    });
  });
  
  increaseButtons.forEach(button => {
    button.addEventListener('click', () => {
      const index = parseInt(button.dataset.index);
      const input = quantityInputs[index];
      let quantity = parseInt(input.value);
      
      input.value = ++quantity;
      updateCartItemQuantity(index, quantity);
    });
  });
  
  quantityInputs.forEach(input => {
    input.addEventListener('change', () => {
      const index = parseInt(input.dataset.index);
      let quantity = parseInt(input.value);
      
      if (isNaN(quantity) || quantity < 1) {
        quantity = 1;
        input.value = 1;
      }
      
      updateCartItemQuantity(index, quantity);
    });
  });
  
  removeButtons.forEach(button => {
    button.addEventListener('click', () => {
      const index = parseInt(button.dataset.index);
      cart.removeItem(index);
      loadCartItems();
      updateCartSummary();
    });
  });
  
  // Update cart summary
  updateCartSummary();
}

// Update cart item quantity
function updateCartItemQuantity(index, quantity) {
  cart.updateItem(index, quantity);
  updateCartSummary();
}

// Update cart summary
function updateCartSummary() {
  if (!cartSubtotal || !cartShipping || !cartTotal) return;
  
  const subtotal = cart.getTotal();
  
  // Calculate shipping
  const shipping = subtotal > shippingThreshold ? 0 : standardShipping;
  
  // Calculate total
  const total = subtotal - discountAmount + shipping;
  
  // Update summary display
  cartSubtotal.textContent = formatCurrency(subtotal);
  cartShipping.textContent = shipping === 0 ? 'Free' : formatCurrency(shipping);
  cartTotal.textContent = formatCurrency(total);
  
  // Update discount display
  if (cartDiscount) {
    cartDiscount.textContent = formatCurrency(discountAmount);
  }
}

// Apply coupon code
function applyCoupon(code) {
  // In a real implementation, this would validate the coupon code with the server
  // For this example, we'll use a simple predefined coupon
  if (code.toUpperCase() === 'WELCOME10') {
    const subtotal = cart.getTotal();
    discountAmount = subtotal * 0.1; // 10% discount
    discountCode = code;
    
    // Show success message
    showCouponMessage('Coupon applied successfully! You got 10% off.', 'success');
    
    updateCartSummary();
    return true;
  } else if (code.toUpperCase() === 'FREESHIP') {
    // Free shipping coupon
    discountAmount = standardShipping;
    discountCode = code;
    
    // Show success message
    showCouponMessage('Coupon applied successfully! You got free shipping.', 'success');
    
    updateCartSummary();
    return true;
  } else {
    // Invalid coupon
    showCouponMessage('Invalid coupon code. Please try again.', 'error');
    return false;
  }
}

// Show coupon message
function showCouponMessage(message, type) {
  const couponContainer = couponCodeInput?.parentElement;
  if (!couponContainer) return;
  
  // Remove any existing message
  const existingMessage = couponContainer.querySelector('.coupon-message');
  if (existingMessage) {
    existingMessage.remove();
  }
  
  // Create new message
  const messageElement = document.createElement('div');
  messageElement.className = `coupon-message ${type}`;
  messageElement.textContent = message;
  
  // Add message after input
  couponContainer.appendChild(messageElement);
  
  // Style the message
  const style = document.createElement('style');
  style.textContent = `
    .coupon-message {
      margin-top: 8px;
      padding: 6px 12px;
      border-radius: 4px;
      font-size: 0.85rem;
    }
    .coupon-message.success {
      background-color: rgba(67, 160, 71, 0.1);
      color: var(--success);
    }
    .coupon-message.error {
      background-color: rgba(229, 57, 53, 0.1);
      color: var(--error);
    }
  `;
  document.head.appendChild(style);
  
  // Remove message after 5 seconds
  setTimeout(() => {
    messageElement.remove();
  }, 5000);
}

// Load recommended products
function loadRecommendedProducts() {
  if (!recommendedProductsContainer) return;
  
  // Generate products HTML
  const productsHTML = recommendedProducts.map(product => createProductCard(product)).join('');
  
  recommendedProductsContainer.innerHTML = productsHTML;
  
  // Add event listeners to the newly created add-to-cart buttons
  const addToCartButtons = recommendedProductsContainer.querySelectorAll('.add-to-cart-btn');
  addToCartButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const productId = button.dataset.productId;
      const product = recommendedProducts.find(p => p.id === parseInt(productId));
      if (product) {
        cart.addItem(product);
        loadCartItems();
      }
    });
  });
}

// Initialize event listeners
function initEventListeners() {
  // Clear cart button
  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear your cart?')) {
        cart.clearCart();
        loadCartItems();
      }
    });
  }
  
  // Update cart button
  if (updateCartBtn) {
    updateCartBtn.addEventListener('click', () => {
      // This is handled automatically by the input change events
      // Just show a confirmation message
      const message = document.createElement('div');
      message.className = 'alert alert-success';
      message.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        <p>Cart updated successfully!</p>
      `;
      
      // Insert message after cart buttons
      const cartButtons = document.querySelector('.cart-buttons');
      if (cartButtons) {
        cartButtons.insertAdjacentElement('afterend', message);
        
        // Remove message after 3 seconds
        setTimeout(() => {
          message.remove();
        }, 3000);
      }
    });
  }
  
  // Apply coupon button
  if (applyCouponBtn && couponCodeInput) {
    applyCouponBtn.addEventListener('click', () => {
      const code = couponCodeInput.value.trim();
      if (code) {
        applyCoupon(code);
      }
    });
    
    // Also allow Enter key to apply coupon
    couponCodeInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const code = couponCodeInput.value.trim();
        if (code) {
          applyCoupon(code);
        }
      }
    });
  }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
  loadCartItems();
  loadRecommendedProducts();
  initEventListeners();
});