let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');

    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <span>${item.name}</span>
            <span>₹${item.price} x ${item.quantity}</span>
            <span>₹${itemTotal}</span>
            <button onclick="removeFromCart(${index})">Remove</button>
        `;
        cartItems.appendChild(div);
    });

    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartTotal.textContent = `Total: ₹${total}`;
    checkoutBtn.disabled = cart.length === 0;
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price: parseInt(price), quantity: 1 });
    }
    updateCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
cartBtn.addEventListener('click', (e) => {
    e.preventDefault();
    cartModal.style.display = 'block';
    updateCart();
});

document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        const menuItem = button.closest('.menu-item');
        const name = menuItem.dataset.name;
        const price = menuItem.dataset.price;
        addToCart(name, price);
    });
});

const checkoutBtn = document.getElementById('checkout-btn');
const transactionModal = document.getElementById('transaction-modal');
const transactionForm = document.getElementById('transaction-form');
const transactionMessage = document.getElementById('transaction-message');

checkoutBtn.addEventListener('click', () => {
    cartModal.style.display = 'none';
    transactionModal.style.display = 'block';
});

transactionForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const address = document.getElementById('delivery-address').value;
    const paymentMethod = document.getElementById('payment-method').value;

    transactionMessage.textContent = `Order confirmed! Delivering to ${address} via ${paymentMethod}.`;
    transactionMessage.style.color = 'green';
    cart = [];
    updateCart();
    transactionForm.reset();
    setTimeout(() => {
        transactionModal.style.display = 'none';
        transactionMessage.textContent = '';
    }, 2000);
});

const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const loginModal = document.getElementById('login-modal');
const signupModal = document.getElementById('signup-modal');
const closes = document.querySelectorAll('.close');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const loginMessage = document.getElementById('login-message');
const signupMessage = document.getElementById('signup-message');

loginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    loginModal.style.display = 'block';
});

signupBtn.addEventListener('click', (e) => {
    e.preventDefault();
    signupModal.style.display = 'block';
});

closes.forEach(close => {
    close.addEventListener('click', () => {
        loginModal.style.display = 'none';
        signupModal.style.display = 'none';
        cartModal.style.display = 'none';
        transactionModal.style.display = 'none';
        loginMessage.textContent = '';
        signupMessage.textContent = '';
        transactionMessage.textContent = '';
    });
});

window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        loginModal.style.display = 'none';
        loginMessage.textContent = '';
    }
    if (e.target === signupModal) {
        signupModal.style.display = 'none';
        signupMessage.textContent = '';
    }
    if (e.target === cartModal) {
        cartModal.style.display = 'none';
    }
    if (e.target === transactionModal) {
        transactionModal.style.display = 'none';
        transactionMessage.textContent = '';
    }
});

signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.some(user => user.email === email)) {
        signupMessage.textContent = 'Email already registered!';
        signupMessage.style.color = 'red';
        return;
    }

    users.push({ name, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    signupMessage.textContent = 'Sign up successful! Please login.';
    signupMessage.style.color = 'green';
    signupForm.reset();
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        loginMessage.textContent = `Welcome back, ${user.name}!`;
        loginMessage.style.color = 'green';
        loginModal.style.display = 'none';
        loginBtn.textContent = `Hi, ${user.name}`;
        signupBtn.style.display = 'none';
    } else {
        loginMessage.textContent = 'Invalid email or password!';
        loginMessage.style.color = 'red';
    }
});

document.querySelectorAll('.nav-links a:not(#login-btn):not(#signup-btn):not(#cart-btn)').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        window.scrollTo({
            top: targetElement.offsetTop - 60,
            behavior: 'smooth'
        });
    });
});

window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a:not(#login-btn):not(#signup-btn):not(#cart-btn)');
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 60;
        if (pageYOffset >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
});