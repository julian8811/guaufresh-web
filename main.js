/**
 * Guaufresh Main Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('Guaufresh Website Initialized');
    initCart();
    initLimitedOfferPopup();
});

function initCart() {
    let cart = JSON.parse(localStorage.getItem('guaufresh_cart')) || [];
    updateCartCount(cart.length);
}

function updateCartCount(count) {
    const badges = document.querySelectorAll('.cart-count-badge');
    badges.forEach(badge => {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
    });
}

function initLimitedOfferPopup() {
    // Show popup after 5 seconds if not seen before in this session
    if (!sessionStorage.getItem('offer_popup_shown')) {
        setTimeout(() => {
            showPopup();
        }, 5000);
    }
}

function showPopup() {
    const popupHtml = `
        <div id="offer-popup" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div class="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden max-w-lg w-full shadow-2xl relative animate-scale-up">
                <button onclick="closePopup()" class="absolute top-4 right-4 size-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-primary transition-colors">
                    <span class="material-symbols-outlined">close</span>
                </button>
                <div class="p-8 text-center">
                    <span class="inline-block px-4 py-1 rounded-full bg-primary/20 text-primary-dark font-bold text-xs uppercase tracking-widest mb-4">Limited Offer</span>
                    <h3 class="text-3xl font-black mb-4">Get 20% OFF!</h3>
                    <p class="text-slate-600 dark:text-slate-400 mb-8">Subscribe to our newsletter and receive a discount code for your first order.</p>
                    <form class="space-y-4">
                        <input type="email" placeholder="your@email.com" class="w-full px-6 py-4 rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary outline-none">
                        <button type="button" class="w-full bg-primary hover:bg-primary-dark text-slate-900 font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/25">Claim My Discount</button>
                    </form>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', popupHtml);
    sessionStorage.setItem('offer_popup_shown', 'true');
}

window.closePopup = () => {
    const popup = document.getElementById('offer-popup');
    if (popup) popup.remove();
};
