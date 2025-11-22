// Checkout Page JavaScript

// DOM Elements
const checkoutForm = document.getElementById('checkout-form');
const billingSameCheckbox = document.getElementById('billing-same');
const billingAddressSection = document.getElementById('billing-address-section');
const orderItems = document.getElementById('order-items');
const orderSubtotal = document.getElementById('order-subtotal');
const orderShipping = document.getElementById('order-shipping');
const orderTax = document.getElementById('order-tax');
const orderDiscount = document.getElementById('order-discount');
const orderTotal = document.getElementById('order-total');
const discountRow = document.getElementById('discount-row');
const couponToggle = document.getElementById('toggle-coupon');
const couponForm = document.getElementById('coupon-form');
const applyCouponBtn = document.getElementById('apply-coupon');
const couponCodeInput = document.getElementById('coupon-code');
const shippingOptions = document.querySelectorAll('input[name="shipping"]');

// Cart state
let discountAmount = 0;
let discountCode = '';
const taxRate = 0.08; // 8% tax rate
const shippingRates = {
  'standard': 5.99,
  'express': 12.99,
  'overnight': 19.99
};
const shippingThreshold = 50; // Free shipping threshold for standard shipping

// Load order summary
function loadOrderSummary() {
  if (!orderItems) return;
  
  const cartItems = cart.items;
  
  // Check if cart is empty and redirect to cart page if needed
  if (cartItems.length === 0) {
    window.location.href = 'cart.html';
    return;
  }
  
  // Generate order items HTML
  const orderItemsHTML = cartItems.map(item => {
    const itemPrice = item.salePrice || item.price;
    const colorInfo = item.selectedOptions?.color ? `Color: ${item.selectedOptions.color}` : '';
    const sizeInfo = item.selectedOptions?.size ? `Size: ${item.selectedOptions.size}` : '';
    const optionsText = [colorInfo, sizeInfo].filter(Boolean).join(', ');
    
    return `
      <div class="order-item">
        <div class="order-item-image">
          <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="order-item-details">
          <div class="order-item-name">${item.name}</div>
          <div class="order-item-meta">${optionsText}</div>
          <div class="order-item-price">${formatCurrency(itemPrice)} × ${item.quantity}</div>
        </div>
      </div>
    `;
  }).join('');
  
  orderItems.innerHTML = orderItemsHTML;
  
  // Update order summary totals
  updateOrderSummary();
}

// Update order summary totals
function updateOrderSummary() {
  if (!orderSubtotal || !orderShipping || !orderTax || !orderTotal) return;
  
  const subtotal = cart.getTotal();
  
  // Get selected shipping method
  const selectedShipping = document.querySelector('input[name="shipping"]:checked')?.value || 'standard';
  let shipping = shippingRates[selectedShipping];
  
  // Apply free shipping for standard shipping if subtotal is above threshold
  if (selectedShipping === 'standard' && subtotal >= shippingThreshold) {
    shipping = 0;
  }
  
  // Calculate tax (on subtotal only, not shipping)
  const tax = subtotal * taxRate;
  
  // Calculate total
  const total = subtotal + shipping + tax - discountAmount;
  
  // Update summary display
  orderSubtotal.textContent = formatCurrency(subtotal);
  orderShipping.textContent = shipping === 0 ? 'Free' : formatCurrency(shipping);
  orderTax.textContent = formatCurrency(tax);
  orderTotal.textContent = formatCurrency(total);
  
  // Update discount display
  if (orderDiscount && discountRow) {
    if (discountAmount > 0) {
      orderDiscount.textContent = `-${formatCurrency(discountAmount)}`;
      discountRow.classList.remove('hidden');
    } else {
      discountRow.classList.add('hidden');
    }
  }
}

// Toggle billing address section
function toggleBillingAddressSection() {
  if (!billingSameCheckbox || !billingAddressSection) return;
  
  billingAddressSection.style.display = billingSameCheckbox.checked ? 'none' : 'block';
}

// Apply coupon code
function applyCoupon(code) {
  // In a real implementation, this would validate the coupon code with the server
  // For this example, we'll use simple predefined coupons
  if (code.toUpperCase() === 'WELCOME10') {
    const subtotal = cart.getTotal();
    discountAmount = subtotal * 0.1; // 10% discount
    discountCode = code;
    
    // Show success message
    showCouponMessage('Coupon applied successfully! You got 10% off.', 'success');
    
    updateOrderSummary();
    return true;
  } else if (code.toUpperCase() === 'FREESHIP') {
    // Free shipping coupon
    discountAmount = shippingRates.standard;
    discountCode = code;
    
    // Show success message
    showCouponMessage('Coupon applied successfully! You got free shipping.', 'success');
    
    updateOrderSummary();
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

// Validate checkout form
function validateCheckoutForm(form) {
  const requiredFields = form.querySelectorAll('[required]');
  let isValid = true;
  
  // Remove any existing error messages
  const existingErrors = form.querySelectorAll('.form-error');
  existingErrors.forEach(error => error.remove());
  
  // Check each required field
  requiredFields.forEach(field => {
    if (!field.value.trim()) {
      isValid = false;
      showFieldError(field, 'This field is required');
    }
  });
  
  // Validate email format
  const emailField = form.querySelector('#email');
  if (emailField && emailField.value.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailField.value.trim())) {
      isValid = false;
      showFieldError(emailField, 'Please enter a valid email address');
    }
  }
  
  // Validate credit card fields if credit card payment is selected
  const creditCardPayment = form.querySelector('input[name="payment"][value="credit-card"]');
  if (creditCardPayment && creditCardPayment.checked) {
    // Card number validation (basic check for 16 digits)
    const cardNumberField = form.querySelector('#card-number');
    if (cardNumberField && cardNumberField.value.trim()) {
      const cardNumber = cardNumberField.value.replace(/\D/g, '');
      if (cardNumber.length !== 16) {
        isValid = false;
        showFieldError(cardNumberField, 'Please enter a valid 16-digit card number');
      }
    }
    
    // Expiry date validation (MM/YY format)
    const expiryField = form.querySelector('#expiry');
    if (expiryField && expiryField.value.trim()) {
      const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
      if (!expiryRegex.test(expiryField.value.trim())) {
        isValid = false;
        showFieldError(expiryField, 'Please enter a valid expiry date (MM/YY)');
      } else {
        // Check if card is expired
        const [month, year] = expiryField.value.split('/');
        const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
        const today = new Date();
        if (expiry < today) {
          isValid = false;
          showFieldError(expiryField, 'This card has expired');
        }
      }
    }
    
    // CVV validation (3-4 digits)
    const cvvField = form.querySelector('#cvv');
    if (cvvField && cvvField.value.trim()) {
      const cvv = cvvField.value.replace(/\D/g, '');
      if (cvv.length < 3 || cvv.length > 4) {
        isValid = false;
        showFieldError(cvvField, 'Please enter a valid CVV (3-4 digits)');
      }
    }
  }
  
  // Check terms acceptance
  const termsCheckbox = form.querySelector('#terms');
  if (termsCheckbox && !termsCheckbox.checked) {
    isValid = false;
    showFieldError(termsCheckbox, 'You must accept the terms and conditions');
  }
  
  return isValid;
}

// Show field error message
function showFieldError(field, message) {
  // Create error message element
  const errorElement = document.createElement('div');
  errorElement.className = 'form-error';
  errorElement.textContent = message;
  
  // Add error styling to field
  field.classList.add('field-error');
  
  // For checkboxes and radio buttons, append to parent element
  if (field.type === 'checkbox' || field.type === 'radio') {
    const parent = field.parentElement;
    parent.appendChild(errorElement);
  } else {
    // For other fields, append after field
    field.insertAdjacentElement('afterend', errorElement);
  }
  
  // Style the error message and field
  const style = document.createElement('style');
  style.textContent = `
    .form-error {
      color: var(--error);
      font-size: 0.85rem;
      margin-top: 4px;
    }
    .field-error {
      border-color: var(--error) !important;
    }
  `;
  document.head.appendChild(style);
  
  // Remove error when field is changed
  field.addEventListener('input', () => {
    field.classList.remove('field-error');
    errorElement.remove();
  });
}

// Format credit card input
function formatCardNumber(input) {
  let value = input.value.replace(/\D/g, '');
  let formattedValue = '';
  
  for (let i = 0; i < value.length; i++) {
    if (i > 0 && i % 4 === 0) {
      formattedValue += ' ';
    }
    formattedValue += value[i];
  }
  
  input.value = formattedValue;
}

// Format expiry date input
function formatExpiryDate(input) {
  let value = input.value.replace(/\D/g, '');
  
  if (value.length > 2) {
    input.value = value.substring(0, 2) + '/' + value.substring(2, 4);
  } else {
    input.value = value;
  }
}

// Process checkout
function processCheckout(form) {
  // In a real implementation, this would send the form data to the server
  // For this example, we'll just show a confirmation page
  
  // Create confirmation page
  const confirmationHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation - Elegance</title>
      <link rel="stylesheet" href="css/styles.css">
      <link rel="stylesheet" href="css/checkout.css">
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      <script src="js/main.js" defer></script>
    </head>
    <body>
      <header class="header">
        <div class="header-container container">
          <div class="logo">
            <a href="index.html">Elegance</a>
          </div>
          <nav class="main-nav">
            <ul class="nav-list">
              <li><a href="index.html">Home</a></li>
              <li><a href="products.html">Shop</a></li>
              <li><a href="about.html">About</a></li>
              <li><a href="contact.html">Contact</a></li>
            </ul>
          </nav>
          <div class="header-icons">
            <div class="search-toggle">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
            <a href="cart.html" class="cart-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
              <span class="cart-count">0</span>
            </a>
          </div>
        </div>
      </header>

      <main>
        <section class="page-header">
          <div class="container">
            <h1>Order Confirmation</h1>
            <div class="breadcrumbs">
              <a href="index.html">Home</a> / <a href="cart.html">Cart</a> / <a href="checkout.html">Checkout</a> / <span>Confirmation</span>
            </div>
          </div>
        </section>

        <section class="confirmation-section container">
          <div class="checkout-steps">
            <div class="step active">
              <div class="step-number">1</div>
              <div class="step-label">Shopping Cart</div>
            </div>
            <div class="step active">
              <div class="step-number">2</div>
              <div class="step-label">Checkout</div>
            </div>
            <div class="step active">
              <div class="step-number">3</div>
              <div class="step-label">Confirmation</div>
            </div>
          </div>

          <div class="confirmation-content">
            <div class="confirmation-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
            <h2>Thank You for Your Order!</h2>
            <p>Your order has been placed successfully. We've sent a confirmation email to <strong>${form.email.value}</strong>.</p>
            
            <div class="order-details">
              <div class="order-info">
                <h3>Order Information</h3>
                <p><strong>Order Number:</strong> #${Math.floor(100000 + Math.random() * 900000)}</p>
                <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
                <p><strong>Payment Method:</strong> ${form.querySelector('input[name="payment"]:checked').value === 'credit-card' ? 'Credit Card' : 'PayPal'}</p>
                <p><strong>Shipping Method:</strong> ${document.querySelector('input[name="shipping"]:checked').nextElementSibling.querySelector('.shipping-option-name').textContent}</p>
              </div>
              
              <div class="shipping-info">
                <h3>Shipping Address</h3>
                <p>${form['first-name'].value} ${form['last-name'].value}</p>
                <p>${form.address.value}</p>
                ${form.address2.value ? `<p>${form.address2.value}</p>` : ''}
                <p>${form.city.value}, ${form.state.value} ${form.zip.value}</p>
                <p>${form.country.value}</p>
              </div>
            </div>
            
            <div class="order-summary">
              <h3>Order Summary</h3>
              <div id="confirmation-items">
                ${orderItems.innerHTML}
              </div>
              <div class="order-totals">
                <div class="order-row">
                  <span>Subtotal</span>
                  <span>${orderSubtotal.textContent}</span>
                </div>
                <div class="order-row">
                  <span>Shipping</span>
                  <span>${orderShipping.textContent}</span>
                </div>
                <div class="order-row">
                  <span>Tax</span>
                  <span>${orderTax.textContent}</span>
                </div>
                ${discountAmount > 0 ? `
                <div class="order-row discount">
                  <span>Discount</span>
                  <span>-${formatCurrency(discountAmount)}</span>
                </div>
                ` : ''}
                <div class="order-total">
                  <span>Total</span>
                  <span>${orderTotal.textContent}</span>
                </div>
              </div>
            </div>
            
            <div class="confirmation-actions">
              <a href="index.html" class="btn btn-primary">Continue Shopping</a>
              <button class="btn btn-secondary" onclick="window.print()">Print Receipt</button>
            </div>
          </div>
        </section>
      </main>

      <footer class="footer">
        <div class="container">
          <div class="footer-grid">
            <div class="footer-col">
              <h3 class="footer-logo">Elegance</h3>
              <p>Premium fashion for every occasion. Our curated collection offers the finest quality apparel and accessories.</p>
              <div class="social-icons">
                <a href="#" class="social-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
                <a href="#" class="social-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
                <a href="#" class="social-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
                </a>
                <a href="#" class="social-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
              </div>
            </div>
            <div class="footer-col">
              <h4>Shop</h4>
              <ul class="footer-links">
                <li><a href="products.html?category=clothing">Clothing</a></li>
                <li><a href="products.html?category=accessories">Accessories</a></li>
                <li><a href="products.html?category=footwear">Footwear</a></li>
                <li><a href="products.html?category=new">New Arrivals</a></li>
                <li><a href="products.html?category=sale">Sale</a></li>
              </ul>
            </div>
            <div class="footer-col">
              <h4>Customer Service</h4>
              <ul class="footer-links">
                <li><a href="#">Contact Us</a></li>
                <li><a href="#">Shipping & Returns</a></li>
                <li><a href="#">FAQ</a></li>
                <li><a href="#">Size Guide</a></li>
                <li><a href="#">Track Order</a></li>
              </ul>
            </div>
            <div class="footer-col">
              <h4>Company</h4>
              <ul class="footer-links">
                <li><a href="#">About Us</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms & Conditions</a></li>
                <li><a href="#">Sustainability</a></li>
              </ul>
            </div>
          </div>
          <div class="footer-bottom">
            <p>&copy; 2025 Elegance. All rights reserved.</p>
            <div class="payment-methods">
              <img src="https://via.placeholder.com/40x25" alt="Visa">
              <img src="https://via.placeholder.com/40x25" alt="Mastercard">
              <img src="https://via.placeholder.com/40x25" alt="American Express">
              <img src="https://via.placeholder.com/40x25" alt="PayPal">
            </div>
          </div>
        </div>
      </footer>

      <style>
        .confirmation-content {
          text-align: center;
          padding: var(--spacing-8) 0;
        }
        
        .confirmation-icon {
          margin: 0 auto var(--spacing-4);
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background-color: rgba(67, 160, 71, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .confirmation-icon .icon {
          color: var(--success);
        }
        
        .confirmation-content h2 {
          margin-bottom: var(--spacing-2);
        }
        
        .confirmation-content > p {
          margin-bottom: var(--spacing-6);
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }
        
        .order-details {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--spacing-6);
          margin-bottom: var(--spacing-6);
          text-align: left;
        }
        
        .order-info, .shipping-info {
          background-color: var(--gray-50);
          padding: var(--spacing-4);
          border-radius: var(--border-radius-md);
        }
        
        .order-info h3, .shipping-info h3 {
          margin-bottom: var(--spacing-3);
          padding-bottom: var(--spacing-2);
          border-bottom: 1px solid var(--gray-200);
        }
        
        .order-info p, .shipping-info p {
          margin-bottom: var(--spacing-2);
        }
        
        .confirmation-actions {
          margin-top: var(--spacing-8);
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-3);
          justify-content: center;
        }
        
        @media (min-width: 768px) {
          .order-details {
            grid-template-columns: 1fr 1fr;
          }
        }
        
        @media print {
          .header, .footer, .confirmation-actions, .page-header, .checkout-steps {
            display: none;
          }
          
          .container {
            max-width: 100%;
            padding: 0;
          }
          
          .confirmation-content {
            padding: 0;
          }
          
          body {
            font-size: 12pt;
          }
          
          .order-details {
            page-break-inside: avoid;
          }
        }
      </style>
    </body>
    </html>
  `;
  
  // Replace current page with confirmation page
  document.open();
  document.write(confirmationHTML);
  document.close();
  
  // Clear cart after successful checkout
  cart.clearCart();
}

// Initialize event listeners
function initEventListeners() {
  // Toggle billing address section when checkbox changes
  if (billingSameCheckbox) {
    billingSameCheckbox.addEventListener('change', toggleBillingAddressSection);
  }
  
  // Show/hide coupon form
  if (couponToggle && couponForm) {
    couponToggle.addEventListener('click', () => {
      couponForm.style.display = couponForm.style.display === 'block' ? 'none' : 'block';
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
  }
  
  // Update shipping cost when shipping option changes
  if (shippingOptions) {
    shippingOptions.forEach(option => {
      option.addEventListener('change', updateOrderSummary);
    });
  }
  
  // Format credit card input
  const cardNumberInput = document.getElementById('card-number');
  if (cardNumberInput) {
    cardNumberInput.addEventListener('input', () => formatCardNumber(cardNumberInput));
  }
  
  // Format expiry date input
  const expiryInput = document.getElementById('expiry');
  if (expiryInput) {
    expiryInput.addEventListener('input', () => formatExpiryDate(expiryInput));
  }
  
  // Handle checkout form submission
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      if (validateCheckoutForm(checkoutForm)) {
        processCheckout(checkoutForm);
      }
    });
  }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
  loadOrderSummary();
  toggleBillingAddressSection();
  initEventListeners();
});