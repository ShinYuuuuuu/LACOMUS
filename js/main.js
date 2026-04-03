// LACOMUS Main JavaScript
// Cart functionality and UI interactions

document.addEventListener('DOMContentLoaded', function() {
    // ===== CART FUNCTIONALITY =====
    const cart = {
        items: [],
        total: 0,
        
        // Add item to cart
        addItem(productId, productName, price, quantity = 1) {
            const existingItem = this.items.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                this.items.push({
                    id: productId,
                    name: productName,
                    price: price,
                    quantity: quantity
                });
            }
            
            this.updateTotal();
            this.updateUI();
            this.saveToLocalStorage();
            this.showAddToCartNotification(productName);
        },
        
        // Remove item from cart
        removeItem(productId) {
            this.items = this.items.filter(item => item.id !== productId);
            this.updateTotal();
            this.updateUI();
            this.saveToLocalStorage();
        },
        
        // Update item quantity
        updateQuantity(productId, quantity) {
            const item = this.items.find(item => item.id === productId);
            if (item) {
                item.quantity = quantity;
                if (item.quantity <= 0) {
                    this.removeItem(productId);
                } else {
                    this.updateTotal();
                    this.updateUI();
                    this.saveToLocalStorage();
                }
            }
        },
        
        // Calculate total
        updateTotal() {
            this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        },
        
        // Clear cart
        clearCart() {
            this.items = [];
            this.total = 0;
            this.updateUI();
            this.saveToLocalStorage();
        },
        
        // Update UI elements
        updateUI() {
            // Update cart count
            const cartCount = document.querySelector('.cart-count');
            const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
            
            // Update cart modal
            this.updateCartModal();
        },
        
        // Update cart modal content
        updateCartModal() {
            const cartItemsElement = document.querySelector('.cart-items');
            const cartTotalPrice = document.querySelector('.cart-total-price');
            const cartEmpty = document.querySelector('.cart-empty');
            
            if (this.items.length === 0) {
                cartItemsElement.innerHTML = '<p class="cart-empty">Your cart is empty</p>';
                cartEmpty.style.display = 'block';
            } else {
                cartEmpty.style.display = 'none';
                cartItemsElement.innerHTML = this.items.map(item => `
                    <div class="cart-item" data-id="${item.id}">
                        <div class="cart-item-info">
                            <h4>${item.name}</h4>
                            <p class="cart-item-price">₱${item.price.toLocaleString()}</p>
                        </div>
                        <div class="cart-item-controls">
                            <button class="cart-item-decrease">-</button>
                            <span class="cart-item-quantity">${item.quantity}</span>
                            <button class="cart-item-increase">+</button>
                            <button class="cart-item-remove">&times;</button>
                        </div>
                    </div>
                `).join('');
                
                // Add event listeners to cart item buttons
                document.querySelectorAll('.cart-item-decrease').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const itemId = parseInt(e.target.closest('.cart-item').dataset.id);
                        const item = this.items.find(i => i.id === itemId);
                        if (item) this.updateQuantity(itemId, item.quantity - 1);
                    });
                });
                
                document.querySelectorAll('.cart-item-increase').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const itemId = parseInt(e.target.closest('.cart-item').dataset.id);
                        const item = this.items.find(i => i.id === itemId);
                        if (item) this.updateQuantity(itemId, item.quantity + 1);
                    });
                });
                
                document.querySelectorAll('.cart-item-remove').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const itemId = parseInt(e.target.closest('.cart-item').dataset.id);
                        this.removeItem(itemId);
                    });
                });
            }
            
            // Update total price
            cartTotalPrice.textContent = `₱${this.total.toLocaleString()}`;
        },
        
        // Show notification when item is added
        showAddToCartNotification(productName) {
            // Create notification element
            const notification = document.createElement('div');
            notification.className = 'cart-notification';
            notification.innerHTML = `
                <div class="notification-content">
                    <i class="fas fa-check-circle"></i>
                    <span>${productName} added to cart!</span>
                </div>
            `;
            
            // Add styles if not already added
            if (!document.getElementById('cart-notification-styles')) {
                const style = document.createElement('style');
                style.id = 'cart-notification-styles';
                style.textContent = `
                    .cart-notification {
                        position: fixed;
                        bottom: 20px;
                        right: 20px;
                        background: var(--gold);
                        color: var(--black);
                        padding: 15px 25px;
                        border-radius: 10px;
                        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
                        z-index: 3000;
                        animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s forwards;
                        font-weight: 600;
                    }
                    .notification-content {
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    }
                    .notification-content i {
                        font-size: 1.2rem;
                    }
                    @keyframes slideIn {
                        from { transform: translateX(100%); opacity: 0; }
                        to { transform: translateX(0); opacity: 1; }
                    }
                    @keyframes fadeOut {
                        to { opacity: 0; transform: translateX(100%); }
                    }
                `;
                document.head.appendChild(style);
            }
            
            // Add and remove notification
            document.body.appendChild(notification);
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 3000);
        },
        
        // Save cart to localStorage
        saveToLocalStorage() {
            localStorage.setItem('lacomus-cart', JSON.stringify({
                items: this.items,
                total: this.total
            }));
        },
        
        // Load cart from localStorage
        loadFromLocalStorage() {
            const savedCart = localStorage.getItem('lacomus-cart');
            if (savedCart) {
                const cartData = JSON.parse(savedCart);
                this.items = cartData.items || [];
                this.total = cartData.total || 0;
                this.updateUI();
            }
        },
        
        // Checkout button handler
        checkout() {
            if (this.items.length === 0) {
                alert('Your cart is empty!');
                return;
            }
            
            // Simulate checkout process
            const checkoutUrl = 'checkout.html'; // You would create this page
            alert('Redirecting to checkout...');
            // window.location.href = checkoutUrl;
        }
    };
    
    // ===== PRODUCT DATA =====
    const products = {
        1: { id: 1, name: 'Midnight Ember', price: 1299 },
        2: { id: 2, name: 'Noir Mystique', price: 1399 },
        3: { id: 3, name: 'Ocean Breeze', price: 1199 },
        4: { id: 4, name: 'Velvet Rose', price: 1499 },
        5: { id: 5, name: 'Citrus Zest', price: 999 },
        6: { id: 6, name: 'Amber Woods', price: 1599 }
    };
    
    // ===== INITIALIZE =====
    cart.loadFromLocalStorage();
    
    // ===== EVENT LISTENERS =====
    
    // Add to cart buttons
    document.addEventListener('click', function(e) {
        if (e.target.matches('.btn-add-to-cart') || e.target.closest('.btn-add-to-cart')) {
            const button = e.target.matches('.btn-add-to-cart') ? e.target : e.target.closest('.btn-add-to-cart');
            const productId = parseInt(button.dataset.id);
            const product = products[productId];
            
            if (product) {
                // Add loading animation
                const originalText = button.textContent;
                button.classList.add('loading');
                button.disabled = true;
                
                // Simulate API delay
                setTimeout(() => {
                    cart.addItem(product.id, product.name, product.price);
                    button.classList.remove('loading');
                    button.disabled = false;
                }, 500);
            }
        }
    });
    
    // Cart modal toggle
    document.querySelectorAll('.cart-btn, .cart-close').forEach(element => {
        element.addEventListener('click', function(e) {
            if (this.matches('.cart-btn')) {
                e.preventDefault();
            }
            document.querySelector('.cart-modal').classList.toggle('show');
        });
    });
    
    // Checkout button
    document.querySelector('.btn-checkout')?.addEventListener('click', function() {
        cart.checkout();
    });
    
    // Close cart when clicking outside
    document.addEventListener('click', function(e) {
        const cartModal = document.querySelector('.cart-modal');
        const cartBtn = document.querySelector('.cart-btn');
        
        if (cartModal.classList.contains('show') && 
            !cartModal.contains(e.target) && 
            !cartBtn.contains(e.target)) {
            cartModal.classList.remove('show');
        }
    });
    
    // ===== MOBILE MENU =====
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            
            // Adjust mobile menu display
            if (navLinks.style.display === 'flex') {
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.right = '0';
                navLinks.style.background = 'var(--dark-gray)';
                navLinks.style.padding = '20px';
                navLinks.style.gap = '20px';
            }
        });
        
        // Close mobile menu on window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                navLinks.style.display = '';
                navLinks.style.flexDirection = '';
                navLinks.style.position = '';
                navLinks.style.top = '';
                navLinks.style.left = '';
                navLinks.style.right = '';
                navLinks.style.background = '';
                navLinks.style.padding = '';
                navLinks.style.gap = '';
            }
        });
    }
    
    // ===== ANIMATIONS =====
    
    // Fade in elements on scroll
    const fadeElements = document.querySelectorAll('.fade-in');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    fadeElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
    
    // ===== STOCK COUNTER ANIMATION =====
    const stockCounters = document.querySelectorAll('.stock-counter');
    stockCounters.forEach(counter => {
        if (counter.classList.contains('limited')) {
            // Add pulsing animation for limited stock
            counter.style.animation = 'pulse 1s infinite';
        }
    });
    
    // ===== BUNDLE TIMER =====
    function updateBundleTimer() {
        const timerElement = document.getElementById('bundle-timer');
        if (!timerElement) return;
        
        let time = 24 * 60 * 60; // 24 hours in seconds
        
        setInterval(() => {
            const hours = Math.floor(time / 3600);
            const minutes = Math.floor((time % 3600) / 60);
            const seconds = time % 60;
            
            timerElement.textContent = 
                `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            time--;
            if (time < 0) time = 24 * 60 * 60; // Reset after 24 hours
        }, 1000);
    }
    
    updateBundleTimer();
    
    // ===== FORM VALIDATION =====
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value.trim();
            
            // Basic validation
            if (!name || !email || !subject || !message) {
                alert('Please fill in all required fields.');
                return;
            }
            
            if (!isValidEmail(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // Simulate form submission
            this.classList.add('loading');
            
            setTimeout(() => {
                this.classList.remove('loading');
                
                // Show success message
                const successMessage = document.getElementById('successMessage');
                const formContainer = document.querySelector('.contact-form-container');
                
                if (successMessage && formContainer) {
                    successMessage.style.display = 'block';
                    this.style.display = 'none';
                    
                    // Reset form
                    this.reset();
                }
                
                // You would typically send data to server here
                console.log('Form submitted:', { name, email, subject, message });
            }, 1000);
        });
    }
    
    // Email validation helper
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // ===== FAQ ACCORDION =====
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const icon = this.querySelector('i');
            
            // Toggle current answer
            if (answer.style.maxHeight) {
                answer.style.maxHeight = null;
                icon.style.transform = 'rotate(0deg)';
            } else {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                icon.style.transform = 'rotate(180deg)';
                
                // Close other answers
                faqQuestions.forEach(otherQuestion => {
                    const otherAnswer = otherQuestion.nextElementSibling;
                    const otherIcon = otherQuestion.querySelector('i');
                    
                    if (otherQuestion !== this && otherAnswer.style.maxHeight) {
                        otherAnswer.style.maxHeight = null;
                        otherIcon.style.transform = 'rotate(0deg)';
                    }
                });
            }
        });
    });
});