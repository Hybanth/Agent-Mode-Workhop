// Enhanced Indian Restaurant Website - JavaScript
// All functionality in pure frontend with localStorage persistence

// Restaurant Menu Data
const menuItems = [
    {
        id: 1,
        name: "Butter Chicken",
        category: "North Indian",
        price: 16.99,
        rating: 4.8,
        description: "Tender chicken in rich tomato-butter sauce",
        image: "butter-chicken.jpg",
        spiceLevel: "Medium",
        isVegetarian: false
    },
    {
        id: 2,
        name: "Palak Paneer",
        category: "North Indian",
        price: 14.99,
        rating: 4.6,
        description: "Cottage cheese cubes in spinach gravy",
        image: "palak-paneer.jpg",
        spiceLevel: "Medium",
        isVegetarian: true
    },
    {
        id: 3,
        name: "Masala Dosa",
        category: "South Indian",
        price: 12.99,
        rating: 4.7,
        description: "Crispy rice crepe with spiced potato filling",
        image: "masala-dosa.jpg",
        spiceLevel: "Medium",
        isVegetarian: true
    }
];

// Order tracking stages
const stages = [
    { status: "Order Received", duration: 1000 },
    { status: "Preparing", duration: 2000 },
    { status: "Ready for Pickup", duration: 1500 },
    { status: "Delivered", duration: 1000 }
];

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(itemId) {
    const item = menuItems.find(item => item.id === itemId);
    if (item) {
        const existingItem = cart.find(cartItem => cartItem.id === itemId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...item, quantity: 1 });
        }
        updateCart();
        showNotification('Item added to cart!');
    }
}

function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateCartTotal();
}

function renderCart() {
    const cartElement = document.getElementById('cart-items');
    if (!cartElement) return;
    
    cartElement.innerHTML = cart.map(item => `
        <div class="cart-item">
            <h4>${item.name}</h4>
            <p>$${item.price} x ${item.quantity}</p>
            <button onclick="removeFromCart(${item.id})">Remove</button>
        </div>
    `).join('');
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCart();
    showNotification('Item removed from cart');
}

function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalElement = document.getElementById('cart-total');
    if (totalElement) {
        totalElement.textContent = `$${total.toFixed(2)}`;
    }
}

function simulateOrderTracking(orderId) {
    let currentStage = 0;
    
    stages.forEach((stage, index) => {
        setTimeout(() => {
            if (index < stages.length - 1) {
                showNotification(`Order #${orderId}: ${stage.status}`);
            } else {
                showNotification(`Order #${orderId}: ${stage.status}`, 'success');
                cart = [];
                updateCart();
            }
        }, stage.duration * (index + 1));
    });
}

// UI Utilities
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Form Handling
function handleReservation(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const reservation = Object.fromEntries(formData.entries());

    // Simple validation
    if (!reservation.name || !reservation.email || !reservation.date || !reservation.time || !reservation.guests) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    // Store reservation (in real app, this would be sent to a server)
    const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    reservations.push({
        ...reservation,
        id: Date.now(),
        status: 'confirmed'
    });
    localStorage.setItem('reservations', JSON.stringify(reservations));
    
    showNotification('Reservation confirmed!', 'success');
    form.reset();
}

// Menu Rendering
function renderMenu() {
    const menuContainer = document.getElementById('menu-container');
    if (!menuContainer) return;

    const categories = [...new Set(menuItems.map(item => item.category))];
    
    menuContainer.innerHTML = categories.map(category => `
        <div class="menu-category">
            <h2>${category}</h2>
            <div class="menu-items">
                ${menuItems
                    .filter(item => item.category === category)
                    .map(item => `
                        <div class="menu-item" data-id="${item.id}">
                            <img src="images/${item.image}" alt="${item.name}">
                            <div class="menu-item-details">
                                <h3>${item.name}</h3>
                                <p class="description">${item.description}</p>
                                <div class="menu-item-footer">
                                    <span class="price">$${item.price}</span>
                                    <span class="rating">⭐ ${item.rating}</span>
                                    ${item.isVegetarian ? '<span class="veg-badge">🌱 Veg</span>' : ''}
                                </div>
                                <button onclick="addToCart(${item.id})">Add to Cart</button>
                            </div>
                        </div>
                    `).join('')}
            </div>
        </div>
    `).join('');
}

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize menu
    renderMenu();
    
    // Initialize cart
    renderCart();
    updateCartTotal();
    
    // Setup reservation form
    const reservationForm = document.getElementById('reservation-form');
    if (reservationForm) {
        reservationForm.addEventListener('submit', handleReservation);
    }
    
    // Setup mobile menu toggle
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
    
    // Setup smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open
                navMenu?.classList.remove('active');
            }
        });
    });
});