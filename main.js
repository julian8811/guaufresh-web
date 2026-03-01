/**
 * Guaufresh Main Application Logic
 * Comprehensive Shopping Cart & UI Interaction
 */

class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('guaufresh_cart')) || [];
        this.init();
    }

    init() {
        this.updateBadge();
        this.bindEvents();

        // If on cart page, render it
        if (window.location.pathname.includes('carrito.html')) {
            this.renderCartPage();
        }

        // If on checkout page, render summary
        if (window.location.pathname.includes('checkout.html')) {
            this.renderCheckoutSummary();
        }
    }

    bindEvents() {
        // Global delegate for "Add to Cart" buttons
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-add-to-cart]');
            if (btn) {
                const product = {
                    id: btn.dataset.id,
                    name: btn.dataset.name,
                    price: parseFloat(btn.dataset.price),
                    image: btn.dataset.image,
                    qty: 1
                };
                this.addItem(product);
                this.showToast(`${product.name} añadido al carrito`);
            }
        });
    }

    addItem(product) {
        const existing = this.items.find(item => item.id === product.id);
        if (existing) {
            existing.qty += 1;
        } else {
            this.items.push(product);
        }
        this.save();
    }

    removeItem(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.save();
        if (window.location.pathname.includes('carrito.html')) this.renderCartPage();
    }

    updateQty(id, delta) {
        const item = this.items.find(item => item.id === id);
        if (item) {
            item.qty += delta;
            if (item.qty <= 0) return this.removeItem(id);
        }
        this.save();
        if (window.location.pathname.includes('carrito.html')) this.renderCartPage();
    }

    save() {
        localStorage.setItem('guaufresh_cart', JSON.stringify(this.items));
        this.updateBadge();
    }

    updateBadge() {
        const count = this.items.reduce((sum, item) => sum + item.qty, 0);
        const badges = document.querySelectorAll('#cart-count');
        badges.forEach(badge => {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        });
    }

    getTotal() {
        return this.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    }

    renderCartPage() {
        const container = document.getElementById('cart-items-container');
        const summaryContainer = document.getElementById('cart-summary');

        if (!container) return;

        if (this.items.length === 0) {
            container.innerHTML = `
                <div class="py-20 text-center">
                    <span class="material-symbols-outlined text-6xl text-slate-200 mb-4">shopping_cart_off</span>
                    <h2 class="text-2xl font-bold mb-4">Tu carrito está vacío</h2>
                    <a href="catalogo.html" class="inline-block bg-primary text-slate-900 px-8 py-3 rounded-xl font-bold hover:bg-primary-dark transition-all">Ver Catálogo</a>
                </div>
            `;
            if (summaryContainer) summaryContainer.style.display = 'none';
            return;
        }

        container.innerHTML = this.items.map(item => `
            <div class="flex items-center gap-6 p-6 bg-white rounded-2xl border border-slate-100 mb-4 animate-fade-in">
                <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-cover rounded-xl">
                <div class="flex-1">
                    <h4 class="font-bold text-slate-900">${item.name}</h4>
                    <p class="text-primary font-bold">$${item.price.toFixed(2)}</p>
                </div>
                <div class="flex items-center gap-4 bg-slate-50 rounded-lg p-1">
                    <button onclick="cart.updateQty('${item.id}', -1)" class="w-8 h-8 flex items-center justify-center hover:bg-white rounded-md transition-all text-xl">-</button>
                    <span class="font-bold w-6 text-center">${item.qty}</span>
                    <button onclick="cart.updateQty('${item.id}', 1)" class="w-8 h-8 flex items-center justify-center hover:bg-white rounded-md transition-all text-xl">+</button>
                </div>
                <p class="font-bold text-slate-900 w-24 text-right">$${(item.price * item.qty).toFixed(2)}</p>
                <button onclick="cart.removeItem('${item.id}')" class="text-slate-300 hover:text-red-500 transition-colors">
                    <span class="material-symbols-outlined">delete</span>
                </button>
            </div>
        `).join('');

        if (summaryContainer) {
            summaryContainer.style.display = 'block';
            document.getElementById('cart-subtotal').textContent = `$${this.getTotal().toFixed(2)}`;
            document.getElementById('cart-total').textContent = `$${this.getTotal().toFixed(2)}`;
        }
    }

    renderCheckoutSummary() {
        const container = document.getElementById('checkout-summary-items');
        if (!container) return;

        container.innerHTML = this.items.map(item => `
            <div class="flex justify-between text-sm text-slate-600">
                <span>${item.name} x ${item.qty}</span>
                <span class="font-bold">$${(item.price * item.qty).toFixed(2)}</span>
            </div>
        `).join('');

        document.getElementById('checkout-total').textContent = `$${this.getTotal().toFixed(2)}`;
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-8 right-8 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl z-[200] animate-fade-in-up flex items-center gap-3';
        toast.innerHTML = `<span class="material-symbols-outlined text-primary">check_circle</span> ${message}`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
}

// Global Cart Instance
let cart;

document.addEventListener('DOMContentLoaded', () => {
    cart = new Cart();
    initLimitedOfferPopup();
});

function initLimitedOfferPopup() {
    if (!sessionStorage.getItem('offer_popup_shown')) {
        setTimeout(() => {
            const popup = document.getElementById('offer-popup');
            if (popup) popup.classList.remove('hidden');
        }, 5000);
    }
}

window.closePopup = () => {
    const popup = document.getElementById('offer-popup');
    if (popup) {
        popup.classList.add('hidden');
        sessionStorage.setItem('offer_popup_shown', 'true');
    }
};
