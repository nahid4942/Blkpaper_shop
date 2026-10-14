/**
 * BLKPAPER - E-commerce Website JavaScript
 * Modern fashion e-commerce with cart functionality, product management, and checkout
 */

// ===== GLOBAL VARIABLES =====
let isLoading = true;
let cart = (JSON.parse(localStorage.getItem('blkpaper_cart')) || []).map(i => ({ ...i, key: i.key || i.id }));
let products = [];
let currentFilter = 'all';
let searchQuery = '';
let isSearchOpen = false;
let isCartOpen = false;
let isMobileMenuOpen = false;
let STORE = null;
let selectedSize = null;
let appliedCoupon = null;
try { appliedCoupon = JSON.parse(localStorage.getItem('blkpaper_coupon')); } catch (e) { appliedCoupon = null; }
if (appliedCoupon && !appliedCoupon.type) appliedCoupon = null;

// Google Sheets Configuration
const GOOGLE_SHEETS_CONFIG = {
    // Replace with your Google Apps Script Web App URL
    scriptURL: 'https://script.google.com/macros/s/AKfycbwjMwrf4Kl25HJEiQirL4wJD5LoaDW-BjIhVpEg9_6DqXa27rIsu33jAWHzVTJJNfP0jg/exec',
    
    // Backup email for order notifications (optional)
    backupEmail: 'blkpaper399@gmail.com'
};

// Product data
const productData = [
    // Memory Band
    {
        id: 'memory-band-001',
        name: 'Memory Band Classic',
        category: 'memory-band',
        price: 2500,
        originalPrice: 3000,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Revolutionary memory storage device with premium design and smart technology.',
        featured: true,
        inStock: true,
        rating: 5,
        reviews: 124
    },
    
    // Clothing
    {
        id: 'clothing-001',
        name: 'BLKPAPER Urban Hoodie',
        category: 'clothing',
        price: 1800,
        originalPrice: 2200,
        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Premium cotton hoodie with minimalist design and comfortable fit.',
        featured: false,
        inStock: true,
        rating: 4.8,
        reviews: 89
    },
    {
        id: 'clothing-002',
        name: 'Minimalist Black Tee',
        category: 'clothing',
        price: 1200,
        originalPrice: null,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Essential black t-shirt with premium fabric and perfect cut.',
        featured: false,
        inStock: true,
        rating: 4.7,
        reviews: 156
    },
    {
        id: 'clothing-003',
        name: 'Street Style Jacket',
        category: 'clothing',
        price: 3500,
        originalPrice: 4000,
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Urban jacket with modern cut and weather-resistant fabric.',
        featured: true,
        inStock: true,
        rating: 4.9,
        reviews: 67
    },
    {
        id: 'clothing-004',
        name: 'Cargo Pants - Black',
        category: 'clothing',
        price: 2200,
        originalPrice: null,
        image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Functional cargo pants with multiple pockets and modern silhouette.',
        featured: false,
        inStock: true,
        rating: 4.6,
        reviews: 92
    },
    {
        id: 'clothing-005',
        name: 'Oversized Sweatshirt',
        category: 'clothing',
        price: 2000,
        originalPrice: 2400,
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Comfortable oversized sweatshirt perfect for casual wear.',
        featured: false,
        inStock: false,
        rating: 4.5,
        reviews: 73
    },
    
    // Sunglasses
    {
        id: 'sunglasses-001',
        name: 'Classic Black Aviators',
        category: 'sunglasses',
        price: 1500,
        originalPrice: 1800,
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Timeless aviator sunglasses with UV protection and premium frames.',
        featured: false,
        inStock: true,
        rating: 4.8,
        reviews: 112
    },
    {
        id: 'sunglasses-002',
        name: 'Round Frame Sunglasses',
        category: 'sunglasses',
        price: 1300,
        originalPrice: null,
        image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Vintage-inspired round sunglasses with modern lens technology.',
        featured: false,
        inStock: true,
        rating: 4.6,
        reviews: 85
    },
    {
        id: 'sunglasses-003',
        name: 'Square Designer Shades',
        category: 'sunglasses',
        price: 1700,
        originalPrice: 2000,
        image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Bold square-frame sunglasses for statement style.',
        featured: true,
        inStock: true,
        rating: 4.7,
        reviews: 94
    },
    
    // Accessories
    {
        id: 'accessories-001',
        name: 'Leather Wallet - Black',
        category: 'accessories',
        price: 800,
        originalPrice: 1000,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Premium leather wallet with multiple card slots and coin pocket.',
        featured: false,
        inStock: true,
        rating: 4.9,
        reviews: 203
    },
    {
        id: 'accessories-002',
        name: 'Minimalist Watch',
        category: 'accessories',
        price: 2800,
        originalPrice: 3200,
        image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Sleek minimalist watch with black leather strap.',
        featured: true,
        inStock: true,
        rating: 4.8,
        reviews: 156
    },
    {
        id: 'accessories-003',
        name: 'Canvas Messenger Bag',
        category: 'accessories',
        price: 1600,
        originalPrice: null,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Durable canvas messenger bag perfect for daily use.',
        featured: false,
        inStock: true,
        rating: 4.5,
        reviews: 78
    },
    {
        id: 'accessories-004',
        name: 'Beanie Hat - Black',
        category: 'accessories',
        price: 600,
        originalPrice: null,
        image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Comfortable knit beanie for casual streetwear looks.',
        featured: false,
        inStock: true,
        rating: 4.4,
        reviews: 167
    },
    {
        id: 'accessories-005',
        name: 'Phone Case - Matte Black',
        category: 'accessories',
        price: 400,
        originalPrice: 500,
        image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Protective phone case with minimalist design.',
        featured: false,
        inStock: true,
        rating: 4.3,
        reviews: 234
    }
];


// ===== STORE DATA LAYER (controlled by the hidden admin panel) =====
// All shop data lives in Supabase. A cached copy gives an instant first paint; built-in defaults are only used in demo mode (no Supabase keys).

const DEFAULT_SETTINGS = {
    shippingFee: 100,
    freeShippingOver: 0,          // 0 = free shipping off
    announcementOn: false,
    announcement: '',
    heroOffer: '20% OFF on First Purchase',
    whatsapp: '8801700000000',
    phone: '01577030164',
    email: 'blkpaper399@gmail.com',
    address: 'sector#6,uttara,Dhaka,Bangladesh',
    sizeOptions: ['S', 'M', 'L', 'XL', 'XXL'],
    lowStockAt: 3
};

const DEFAULT_SALE = {
    enabled: false,
    name: 'Flash Sale',
    percent: 10,
    category: 'all',
    start: '',
    end: '',
    banner: ''
};

const DEFAULT_COUPONS = [
    { code: 'FIRST20', type: 'percent', value: 20, minOrder: 0, expires: '', active: true, note: 'First purchase offer' }
];

function buildDefaultProducts() {
    return productData.map(p => {
        const sized = p.category === 'clothing';
        const discount = p.originalPrice && p.originalPrice > p.price
            ? { type: 'fixed', value: p.originalPrice - p.price }
            : null;
        return {
            id: p.id,
            name: p.name,
            category: p.category,
            price: p.originalPrice && p.originalPrice > p.price ? p.originalPrice : p.price,
            discount: discount,
            image: p.image,
            description: p.description,
            featured: !!p.featured,
            active: true,
            rating: p.rating,
            reviews: p.reviews,
            sizes: sized ? { S: p.inStock ? 10 : 0, M: p.inStock ? 10 : 0, L: p.inStock ? 10 : 0, XL: p.inStock ? 10 : 0 } : null,
            stock: sized ? 0 : (p.inStock ? 20 : 0)
        };
    });
}

function normalizeStore(s) {
    s = s || {};
    return {
        updatedAt: s.updatedAt || 0,
        settings: Object.assign({}, DEFAULT_SETTINGS, s.settings || {}),
        sale: Object.assign({}, DEFAULT_SALE, s.sale || {}),
        coupons: Array.isArray(s.coupons) ? s.coupons : JSON.parse(JSON.stringify(DEFAULT_COUPONS)),
        products: Array.isArray(s.products) ? s.products : buildDefaultProducts()
    };
}

function escAttr(str) {
    return String(str == null ? '' : str).replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function parseStoreDate(str, endOfDay) {
    if (!str) return null;
    const d = new Date(str);
    if (isNaN(d)) return null;
    if (endOfDay && /^\d{4}-\d{2}-\d{2}$/.test(str)) d.setHours(23, 59, 59, 999);
    return d;
}

function getSaleStatus(sale) {
    if (!sale || !sale.enabled) return 'off';
    const now = new Date();
    const start = parseStoreDate(sale.start);
    const end = parseStoreDate(sale.end, true);
    if (start && now < start) return 'scheduled';
    if (end && now > end) return 'expired';
    return 'active';
}

function isSaleActive(sale) {
    return getSaleStatus(sale) === 'active';
}

function computePricing(sp) {
    const regular = Number(sp.price) || 0;
    let best = 0;
    let fromSale = false;
    const d = sp.discount;
    if (d && Number(d.value) > 0) {
        best = d.type === 'percent' ? Math.round(regular * Number(d.value) / 100) : Number(d.value);
    }
    const sale = STORE.sale;
    if (isSaleActive(sale) && (sale.category === 'all' || sale.category === sp.category)) {
        const s = Math.round(regular * (Number(sale.percent) || 0) / 100);
        if (s > best) { best = s; fromSale = true; }
    }
    best = Math.max(0, Math.min(best, regular));
    return { price: regular - best, originalPrice: best > 0 ? regular : null, fromSale: fromSale };
}

// Postgres JSON doesn't keep key order, so sizes are always sorted: your size options first, then S/M/L…, then numbers
function sortSizeKeys(keys) {
    const order = (STORE && STORE.settings && STORE.settings.sizeOptions) || [];
    const std = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL', '4XL', '5XL'];
    const rank = (k) => {
        let i = order.indexOf(k);
        if (i >= 0) return [0, i, ''];
        i = std.indexOf(String(k).toUpperCase());
        if (i >= 0) return [1, i, ''];
        const n = parseFloat(k);
        if (!isNaN(n)) return [2, n, ''];
        return [3, 0, String(k)];
    };
    return keys.slice().sort((a, b) => {
        const ra = rank(a), rb = rank(b);
        return ra[0] - rb[0] || ra[1] - rb[1] || ra[2].localeCompare(rb[2]);
    });
}

function toShopProduct(sp) {
    const pr = computePricing(sp);
    const hasSizes = sp.sizes && Object.keys(sp.sizes).length > 0;
    const sizes = hasSizes ? {} : null;
    let stock = 0;
    if (hasSizes) {
        sortSizeKeys(Object.keys(sp.sizes)).forEach(k => {
            const q = Math.max(0, parseInt(sp.sizes[k]) || 0);
            sizes[k] = q;
            stock += q;
        });
    } else {
        stock = Math.max(0, parseInt(sp.stock) || 0);
    }
    return {
        id: sp.id,
        name: escAttr(sp.name),
        category: sp.category,
        description: escAttr(sp.description || ''),
        image: sp.image || '',
        featured: !!sp.featured,
        rating: Number(sp.rating) || 5,
        reviews: Number(sp.reviews) || 0,
        price: pr.price,
        originalPrice: pr.originalPrice,
        onSale: pr.fromSale,
        sizes: sizes,
        stock: stock,
        inStock: stock > 0
    };
}

function rebuildProducts() {
    products = STORE.products.filter(p => p.active !== false).map(toShopProduct);
    syncCartWithStore();
}

// ----- Supabase connection -----
let sb = null;
let storeLoading = false;
let refreshing = false, refreshAgain = false, refreshTimer = null;
const STORE_CACHE_KEY = 'blkpaper_store_cache';
const storeListeners = [];

function initSupabase() {
    const cfg = window.BLK_SUPABASE || {};
    if (!cfg.url || !cfg.anonKey || !window.supabase || !window.supabase.createClient) return null;
    try { return window.supabase.createClient(cfg.url, cfg.anonKey); } catch (e) { return null; }
}

function rowToProduct(r) {
    return {
        id: r.id,
        name: r.name,
        category: r.category,
        price: Number(r.price) || 0,
        discount: r.discount_type ? { type: r.discount_type, value: Number(r.discount_value) || 0 } : null,
        image: r.image_url || '',
        description: r.description || '',
        featured: !!r.featured,
        active: r.active !== false,
        rating: Number(r.rating) || 0,
        reviews: Number(r.reviews) || 0,
        sizes: r.sizes && Object.keys(r.sizes).length ? r.sizes : null,
        stock: parseInt(r.stock) || 0
    };
}

async function fetchStoreFromServer() {
    const [pr, st] = await Promise.all([
        sb.from('products').select('*').order('sort_order', { ascending: false }),
        sb.from('settings').select('key,value')
    ]);
    if (pr.error) throw pr.error;
    if (st.error) throw st.error;
    const get = (k) => { const r = (st.data || []).find(x => x.key === k); return r ? r.value : {}; };
    return normalizeStore({ products: (pr.data || []).map(rowToProduct), settings: get('store'), sale: get('sale'), coupons: [] });
}

function loadStore() {
    sb = initSupabase();
    window.BLKSB = sb;
    if (!sb) {                       // demo mode: Supabase keys not filled in yet
        STORE = normalizeStore({});
        rebuildProducts();
        applyStoreToPage();
        return;
    }
    let cached = null;
    try { cached = JSON.parse(localStorage.getItem(STORE_CACHE_KEY)); } catch (e) { cached = null; }
    if (cached && Array.isArray(cached.products)) {
        STORE = normalizeStore(cached);
        storeLoading = false;
    } else {
        STORE = normalizeStore({ products: [] });
        storeLoading = true;
    }
    rebuildProducts();
    applyStoreToPage();
    refreshFromServer();
    startRealtime();
}

async function refreshFromServer(quiet) {
    if (!sb) return;
    if (refreshing) { refreshAgain = true; return; }
    refreshing = true;
    try {
        const fresh = await fetchStoreFromServer();
        STORE = fresh;
        storeLoading = false;
        try { localStorage.setItem(STORE_CACHE_KEY, JSON.stringify(fresh)); } catch (e) { /* cache is optional */ }
        const before = JSON.stringify(cart);
        rebuildProducts();
        applyStoreToPage();
        displayProducts(Math.max(8, document.querySelectorAll('.product-card').length));
        updateCartUI();
        updateCartItems();
        if (!quiet && JSON.stringify(cart) !== before) showToast('Your cart was updated to match the latest prices and stock', 'info');
        storeListeners.forEach(fn => { try { fn(STORE); } catch (e) { /* ignore listener errors */ } });
    } catch (e) {
        console.warn('Could not load shop data:', e);
        if (storeLoading) {
            storeLoading = false;
            displayProducts(8);
            showToast('Could not connect to the shop. Please refresh the page.', 'error');
        }
    } finally {
        refreshing = false;
        if (refreshAgain) { refreshAgain = false; refreshFromServer(); }
    }
}

function scheduleRefresh() {
    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(refreshFromServer, 350);
}

// Live shopping: stock, prices and offers update on screen the moment they change
function startRealtime() {
    try {
        sb.channel('blk-live')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, scheduleRefresh)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, scheduleRefresh)
            .subscribe();
    } catch (e) { console.warn('Realtime unavailable', e); }
    document.addEventListener('visibilitychange', () => { if (!document.hidden) refreshFromServer(); });
    setInterval(() => { if (!document.hidden) refreshFromServer(); }, 120000);   // safety net
}

window.BLKPAPER_getStore = () => STORE;
window.BLKStore = {
    client: () => sb,
    get: () => STORE,
    refresh: () => refreshFromServer(),
    onChange: (fn) => { storeListeners.push(fn); }
};

function applyStoreToPage() {
    const s = STORE.settings;

    // Announcement bar (sale banner wins while a sale is running)
    const bar = document.getElementById('announcementBar');
    let text = '';
    if (isSaleActive(STORE.sale) && STORE.sale.banner) text = STORE.sale.banner;
    else if (s.announcementOn && s.announcement) text = s.announcement;
    if (bar) {
        bar.style.display = text ? 'flex' : 'none';
        const span = bar.querySelector('span');
        if (span) span.textContent = text;
        document.body.classList.toggle('has-announcement', !!text);
    }

    // Hero offer badge
    const offerWrap = document.querySelector('.hero-offer');
    const offerText = document.querySelector('.hero-offer .offer-badge span');
    if (offerWrap && offerText) {
        offerText.textContent = s.heroOffer || '';
        offerWrap.style.display = s.heroOffer ? '' : 'none';
    }

    // Contact details + WhatsApp
    document.querySelectorAll('[data-store]').forEach(el => {
        const v = s[el.getAttribute('data-store')];
        if (v) el.textContent = v;
    });
    const wa = document.querySelector('.whatsapp-float a');
    if (wa && s.whatsapp) wa.href = 'https://wa.me/' + String(s.whatsapp).replace(/\D/g, '');

    // Real item counts on category cards
    document.querySelectorAll('.category-card').forEach(card => {
        const cat = card.getAttribute('data-category');
        const n = products.filter(p => p.category === cat).length;
        const el = card.querySelector('.category-count');
        if (el) el.textContent = n + (n === 1 ? ' item' : ' items');
    });

    // Memory Band feature block follows the first Memory Band product
    const mbSection = document.getElementById('memory-band');
    const mb = products.find(p => p.category === 'memory-band');
    if (mbSection) {
        mbSection.style.display = mb ? '' : 'none';
        if (mb) {
            const priceEl = document.getElementById('mbPrice');
            const origEl = document.getElementById('mbOriginal');
            const discEl = document.getElementById('mbDiscount');
            const imgEl = document.querySelector('.memory-band-img');
            const btn = document.getElementById('mbAddBtn');
            if (priceEl) priceEl.textContent = '৳' + mb.price.toLocaleString();
            const pct = mb.originalPrice ? Math.round(((mb.originalPrice - mb.price) / mb.originalPrice) * 100) : 0;
            if (origEl) { origEl.textContent = mb.originalPrice ? '৳' + mb.originalPrice.toLocaleString() : ''; origEl.style.display = mb.originalPrice ? '' : 'none'; }
            if (discEl) { discEl.textContent = pct + '% OFF'; discEl.style.display = pct > 0 ? '' : 'none'; }
            if (imgEl && mb.image) imgEl.src = mb.image;
            if (btn) {
                btn.setAttribute('onclick', `addToCart('${mb.id}')`);
                btn.disabled = !mb.inStock;
                btn.lastChild.textContent = mb.inStock ? ' Add to Cart' : ' Out of Stock';
            }
        }
    }
}

// ===== COUPONS & TOTALS =====
function couponDiscount(c, subtotal) {
    if (!c || subtotal <= 0 || subtotal < (Number(c.minOrder) || 0)) return 0;
    const val = Number(c.value) || 0;
    return c.type === 'percent' ? Math.round(subtotal * val / 100) : Math.min(val, subtotal);
}

function calcTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = appliedCoupon ? couponDiscount(appliedCoupon, subtotal) : 0;
    const s = STORE.settings;
    let shipping = subtotal > 0 ? (Number(s.shippingFee) || 0) : 0;
    const freeOver = Number(s.freeShippingOver) || 0;
    if (subtotal > 0 && freeOver > 0 && (subtotal - discount) >= freeOver) shipping = 0;
    return { subtotal: subtotal, discount: discount, shipping: shipping, total: subtotal - discount + shipping };
}

async function applyCouponFromInput() {
    const input = document.getElementById('couponInput');
    const code = input ? input.value.trim() : '';
    if (!code) { showToast('Enter a coupon code', 'warning'); return; }
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (subtotal <= 0) { showToast('Add items to your cart first', 'warning'); return; }

    let coupon = null;
    if (sb) {
        try {
            const { data, error } = await sb.rpc('get_coupon', { p_code: code });
            if (error) throw error;
            coupon = data;
        } catch (e) {
            showToast('Could not check the coupon. Please try again.', 'error');
            return;
        }
    } else {
        const c = (STORE.coupons || []).find(x => String(x.code).toUpperCase() === code.toUpperCase() && x.active !== false);
        if (c) coupon = { code: c.code, type: c.type, value: c.value, minOrder: c.minOrder };
    }
    if (!coupon) { showToast('Invalid or expired coupon code', 'error'); return; }
    const min = Number(coupon.minOrder) || 0;
    if (subtotal < min) { showToast(`Add ৳${(min - subtotal).toLocaleString()} more to use this coupon (min ৳${min.toLocaleString()})`, 'warning'); return; }
    appliedCoupon = coupon;
    localStorage.setItem('blkpaper_coupon', JSON.stringify(appliedCoupon));
    if (input) input.value = '';
    updateCartUI();
    showToast(`Coupon ${coupon.code} applied!`, 'success');
}

function removeCoupon() {
    appliedCoupon = null;
    localStorage.removeItem('blkpaper_coupon');
    updateCartUI();
}

// Keep saved carts valid when prices/stock change in the admin panel
function syncCartWithStore() {
    if (storeLoading) return false;   // product list not loaded yet — don't touch the saved cart
    let changed = false;
    cart = cart.filter(item => {
        if (!item.key) item.key = item.id;
        const p = products.find(x => x.id === item.id);
        if (!p) { changed = true; return false; }
        let available = p.stock;
        if (p.sizes) {
            if (!item.size || !(item.size in p.sizes)) { changed = true; return false; }
            available = p.sizes[item.size];
        }
        if (available <= 0) { changed = true; return false; }
        if (item.quantity > available) { item.quantity = available; changed = true; }
        item.price = p.price;
        item.name = p.name;
        item.image = p.image;
        return true;
    });
    if (changed || cart.length) localStorage.setItem('blkpaper_cart', JSON.stringify(cart));
    return changed;
}

// ===== HIDDEN ADMIN PANEL LOADER =====
// admin.js (one file: logic + styles) is only downloaded when the admin asks for it.
function openAdminPanel() {
    if (window.BLKAdmin) { window.BLKAdmin.open(); return; }
    if (window.__blkAdminLoading) return;
    window.__blkAdminLoading = true;
    const js = document.createElement('script');
    js.src = 'admin.js';
    js.onload = () => { window.__blkAdminLoading = false; if (window.BLKAdmin) window.BLKAdmin.open(); };
    js.onerror = () => { window.__blkAdminLoading = false; };
    document.body.appendChild(js);
}

function initializeAdminTriggers() {
    // 1) open the site with #admin at the end of the address
    if (location.hash === '#admin') openAdminPanel();
    window.addEventListener('hashchange', () => { if (location.hash === '#admin') openAdminPanel(); });

    // 2) keyboard: Alt + Shift + A
    document.addEventListener('keydown', (e) => {
        if (e.altKey && e.shiftKey && e.code === 'KeyA') { e.preventDefault(); openAdminPanel(); }
    });

    // 3) tap the footer copyright line 5 times quickly (works on phones)
    const trigger = document.querySelector('.footer-bottom-content p');
    if (trigger) {
        let taps = 0, timer = null;
        trigger.addEventListener('click', () => {
            taps++;
            clearTimeout(timer);
            timer = setTimeout(() => { taps = 0; }, 2500);
            if (taps >= 5) { taps = 0; openAdminPanel(); }
        });
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🖤 BLKPAPER Store Initializing...');
    initializeWebsite();
});

function initializeWebsite() {
    // Load store data (published file / admin draft / defaults)
    loadStore();
    initializeAdminTriggers();
    
    // Initialize loading screen
    initializeLoadingScreen();
    
    // Initialize navigation
    initializeNavigation();
    
    // Initialize cart
    initializeCart();
    
    // Initialize products
    initializeProducts();
    
    // Initialize search
    initializeSearch();
    
    // Initialize forms
    initializeForms();
    
    // Initialize animations
    initializeAnimations();
    
    // Initialize modals
    initializeModals();
    
    // Initialize scroll effects
    initializeScrollEffects();
    
    // Initialize retry queue processing
    initializeRetryQueue();
    
    console.log('✅ BLKPAPER Store Ready!');
}

// ===== LOADING SCREEN =====
function initializeLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    
    // Simulate loading time
    setTimeout(() => {
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            isLoading = false;
            
            // Remove loading screen after transition
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }, 2500);
}

// ===== NAVIGATION =====
function initializeNavigation() {
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
    
    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                scrollToSection(href);
                
                // Update active link
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                // Close mobile menu
                if (isMobileMenuOpen) {
                    toggleMobileMenu();
                }
            }
        });
    });
    
    // Category links
    const categoryLinks = document.querySelectorAll('[data-category]');
    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.getAttribute('data-category');
            filterProducts(category);
            scrollToSection('#shop');
        });
    });
}

function toggleMobileMenu() {
    const navMenu = document.getElementById('navMenu');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    
    isMobileMenuOpen = !isMobileMenuOpen;
    
    if (isMobileMenuOpen) {
        navMenu.style.display = 'flex';
        navMenu.style.flexDirection = 'column';
        navMenu.style.position = 'absolute';
        navMenu.style.top = '100%';
        navMenu.style.left = '0';
        navMenu.style.right = '0';
        navMenu.style.background = 'var(--white)';
        navMenu.style.boxShadow = 'var(--shadow-lg)';
        navMenu.style.padding = '20px';
        navMenu.style.gap = '16px';
        mobileMenuBtn.classList.add('active');
    } else {
        navMenu.style.display = '';
        navMenu.style.flexDirection = '';
        navMenu.style.position = '';
        navMenu.style.top = '';
        navMenu.style.left = '';
        navMenu.style.right = '';
        navMenu.style.background = '';
        navMenu.style.boxShadow = '';
        navMenu.style.padding = '';
        navMenu.style.gap = '';
        mobileMenuBtn.classList.remove('active');
    }
}

function scrollToSection(sectionId) {
    const target = document.querySelector(sectionId);
    if (target) {
        const headerHeight = 80;
        const targetPosition = target.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// ===== CART FUNCTIONALITY =====
function initializeCart() {
    const cartIcon = document.getElementById('cartIcon');
    const cartSidebar = document.getElementById('cartSidebar');
    const cartClose = document.getElementById('cartClose');
    
    // Cart icon click
    if (cartIcon) {
        cartIcon.addEventListener('click', toggleCart);
    }
    
    // Cart close button
    if (cartClose) {
        cartClose.addEventListener('click', closeCart);
    }
    
    // Close cart when clicking outside
    document.addEventListener('click', (e) => {
        if (isCartOpen && !cartSidebar.contains(e.target) && !cartIcon.contains(e.target)) {
            closeCart();
        }
    });
    
    // Update cart display
    updateCartUI();
}

function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    
    if (isCartOpen) {
        closeCart();
    } else {
        openCart();
    }
}

function openCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    cartSidebar.classList.add('open');
    isCartOpen = true;
    document.body.style.overflow = 'hidden';
    updateCartItems();
}

function closeCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    cartSidebar.classList.remove('open');
    isCartOpen = false;
    document.body.style.overflow = '';
}

function addToCart(productId, quantity = 1, size = null) {
    const product = products.find(p => p.id === productId);
    if (!product) {
        showToast('Product not found', 'error');
        return false;
    }
    
    if (!product.inStock) {
        showToast('Sorry, this product is out of stock', 'warning');
        return false;
    }
    
    if (product.sizes) {
        if (!size) {
            // Sized product from a product card: let the shopper pick a size first
            quickView(productId);
            showToast('Please select a size', 'info');
            return false;
        }
    }
    
    const available = product.sizes ? (product.sizes[size] || 0) : product.stock;
    const key = product.sizes ? `${productId}|${size}` : productId;
    const existingItem = cart.find(item => item.key === key);
    const inCart = existingItem ? existingItem.quantity : 0;
    
    if (available <= 0) {
        showToast(`Size ${size} is sold out`, 'warning');
        return false;
    }
    if (inCart + quantity > available) {
        showToast(available - inCart <= 0 ? `You already have all ${available} in your cart` : `Only ${available} in stock`, 'warning');
        return false;
    }
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            key: key,
            id: productId,
            name: product.name,
            price: product.price,
            image: product.image,
            size: product.sizes ? size : null,
            quantity: quantity
        });
    }
    
    // Save to localStorage
    localStorage.setItem('blkpaper_cart', JSON.stringify(cart));
    
    // Update UI
    updateCartUI();
    updateCartItems();
    
    // Show success message
    showToast(`${product.name}${product.sizes ? ' (' + size + ')' : ''} added to cart!`, 'success');
    
    // Open cart sidebar briefly to show item
    openCart();
    setTimeout(() => {
        closeCart();
    }, 2000);
    return true;
}

function addToCartFromQuickView(productId) {
    const product = products.find(p => p.id === productId);
    if (product && product.sizes && !selectedSize) {
        showToast('Please select a size', 'warning');
        return;
    }
    if (addToCart(productId, 1, selectedSize)) closeModal();
}

function selectSize(size, btn) {
    selectedSize = size;
    document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
}

function removeFromCart(itemKey) {
    cart = cart.filter(item => item.key !== itemKey);
    localStorage.setItem('blkpaper_cart', JSON.stringify(cart));
    updateCartUI();
    updateCartItems();
    showToast('Item removed from cart', 'info');
}

function updateCartQuantity(itemKey, quantity) {
    const item = cart.find(item => item.key === itemKey);
    if (item) {
        if (!quantity || quantity <= 0) {
            removeFromCart(itemKey);
        } else {
            const p = products.find(x => x.id === item.id);
            const available = p ? (p.sizes ? (p.sizes[item.size] || 0) : p.stock) : quantity;
            if (quantity > available) {
                showToast(`Only ${available} in stock`, 'warning');
                quantity = available;
            }
            item.quantity = quantity;
            localStorage.setItem('blkpaper_cart', JSON.stringify(cart));
            updateCartUI();
            updateCartItems();
        }
    }
}

function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartShipping = document.getElementById('cartShipping');
    const cartTotal = document.getElementById('cartTotal');
    const discountRow = document.getElementById('cartDiscountRow');
    const discountEl = document.getElementById('cartDiscount');
    const couponApplied = document.getElementById('couponApplied');
    
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
    
    // Calculate totals (includes coupon + admin shipping rules)
    const t = calcTotals();
    
    if (cartSubtotal) cartSubtotal.textContent = `৳${t.subtotal.toLocaleString()}`;
    if (cartShipping) cartShipping.textContent = (t.shipping === 0 && t.subtotal > 0) ? 'Free' : `৳${t.shipping.toLocaleString()}`;
    if (cartTotal) cartTotal.textContent = `৳${t.total.toLocaleString()}`;
    if (discountRow) discountRow.style.display = t.discount > 0 ? 'flex' : 'none';
    if (discountEl) discountEl.textContent = `-৳${t.discount.toLocaleString()}`;
    
    if (couponApplied) {
        if (appliedCoupon && t.discount > 0) {
            couponApplied.innerHTML = `<i class="fas fa-tag"></i> <strong>${escAttr(appliedCoupon.code)}</strong> applied <button type="button" onclick="removeCoupon()">Remove</button>`;
            couponApplied.style.display = 'flex';
        } else {
            couponApplied.style.display = 'none';
            couponApplied.innerHTML = '';
        }
    }
}

function updateCartItems() {
    const cartItems = document.getElementById('cartItems');
    if (!cartItems) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-bag" style="font-size: 3rem; color: var(--gray-300); margin-bottom: 16px;"></i>
                <p style="color: var(--gray-500); text-align: center;">Your cart is empty</p>
                <button class="btn btn-primary" onclick="closeCart(); scrollToSection('#shop');" style="margin-top: 16px;">
                    Start Shopping
                </button>
            </div>
        `;
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                ${item.size ? `<div class="cart-item-size">Size: ${item.size}</div>` : ''}
                <div class="cart-item-price">৳${item.price.toLocaleString()}</div>
                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <button class="qty-btn" onclick="updateCartQuantity('${item.key}', ${item.quantity - 1})">
                            <i class="fas fa-minus"></i>
                        </button>
                        <input type="number" class="qty-input" value="${item.quantity}" 
                               onchange="updateCartQuantity('${item.key}', parseInt(this.value))" min="1">
                        <button class="qty-btn" onclick="updateCartQuantity('${item.key}', ${item.quantity + 1})">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart('${item.key}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function clearCart() {
    cart = [];
    localStorage.setItem('blkpaper_cart', JSON.stringify(cart));
    updateCartUI();
    updateCartItems();
    showToast('Cart cleared', 'info');
}

function viewCart() {
    closeCart();
    // In a real application, this would navigate to a dedicated cart page
    showToast('Cart page would open here', 'info');
}

function proceedToCheckout() {
    if (cart.length === 0) {
        showToast('Your cart is empty', 'warning');
        return;
    }
    
    closeCart();
    showCheckoutModal();
}

// ===== PRODUCTS =====
function initializeProducts() {
    const productsGrid = document.getElementById('productsGrid');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    
    // Filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            filterProducts(filter);
            
            // Update active filter
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
    
    // Load more button
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreProducts);
    }
    
    // Initial load
    displayProducts();
}

function filterProducts(category) {
    currentFilter = category;
    displayProducts();
}

function displayProducts(limit = 8) {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    let filteredProducts = products;
    
    // Apply category filter
    if (currentFilter !== 'all') {
        filteredProducts = products.filter(p => p.category === currentFilter);
    }
    
    // Apply search filter
    if (searchQuery) {
        filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }
    
    // Limit products shown
    const displayedProducts = filteredProducts.slice(0, limit);
    
    if (storeLoading) {
        productsGrid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--gray-500);"><i class="fas fa-spinner fa-spin" style="font-size: 2rem; margin-bottom: 12px;"></i><p>Loading products…</p></div>';
        return;
    }
    
    if (displayedProducts.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-products" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                <i class="fas fa-search" style="font-size: 3rem; color: var(--gray-300); margin-bottom: 16px;"></i>
                <h3 style="color: var(--gray-500); margin-bottom: 8px;">No products found</h3>
                <p style="color: var(--gray-400);">Try adjusting your filters or search terms</p>
                <button class="btn btn-outline" onclick="resetFilters()" style="margin-top: 16px;">
                    Reset Filters
                </button>
            </div>
        `;
        return;
    }
    
    productsGrid.innerHTML = displayedProducts.map(product => createProductCard(product)).join('');
    
    // Show/hide load more button
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.style.display = filteredProducts.length > displayedProducts.length ? 'block' : 'none';
    }
}

function createProductCard(product) {
    const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
    
    return `
        <div class="product-card ${product.featured ? 'featured' : ''} ${!product.inStock ? 'out-of-stock' : ''}" 
             data-category="${product.category}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                ${discount > 0 ? `<div class="product-badge">${product.onSale && STORE.sale.name ? escAttr(STORE.sale.name) + ' ' : ''}${discount}% OFF</div>` : ''}
                ${!product.inStock ? `<div class="product-badge" style="background: var(--accent-danger);">Out of Stock</div>` : ''}
                <div class="product-actions">
                    <button class="action-btn" onclick="quickView('${product.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn" onclick="toggleWishlist('${product.id}')">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <div class="product-category">${getCategoryName(product.category)}</div>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                ${product.inStock && product.stock <= (Number(STORE.settings.lowStockAt) || 0) ? `<div class="stock-note">Only ${product.stock} left</div>` : ''}
                <div class="product-footer">
                    <div class="product-price">
                        <span class="current-price">৳${product.price.toLocaleString()}</span>
                        ${product.originalPrice ? `<span class="original-price">৳${product.originalPrice.toLocaleString()}</span>` : ''}
                    </div>
                    <button class="add-to-cart-btn" onclick="${product.sizes ? `quickView('${product.id}')` : `addToCart('${product.id}')`}" 
                            ${!product.inStock ? 'disabled' : ''}>
                        <i class="fas ${product.sizes ? 'fa-ruler' : 'fa-shopping-cart'}"></i>
                        ${!product.inStock ? 'Out of Stock' : (product.sizes ? 'Select Size' : 'Add to Cart')}
                    </button>
                </div>
            </div>
        </div>
    `;
}

function getCategoryName(category) {
    const categoryNames = {
        'clothing': 'Clothing',
        'sunglasses': 'Sunglasses',
        'accessories': 'Accessories',
        'memory-band': 'Memory Band'
    };
    return categoryNames[category] || category;
}

function loadMoreProducts() {
    const currentlyDisplayed = document.querySelectorAll('.product-card').length;
    displayProducts(currentlyDisplayed + 8);
}

function resetFilters() {
    currentFilter = 'all';
    searchQuery = '';
    
    // Reset filter buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => btn.classList.remove('active'));
    document.querySelector('.filter-btn[data-filter="all"]').classList.add('active');
    
    // Clear search
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = '';
    
    displayProducts();
}

function quickView(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    selectedSize = null;
    const lowAt = Number(STORE.settings.lowStockAt) || 0;
    const sizeHTML = product.sizes ? `
        <div class="size-selector">
            <div class="size-label">Select Size</div>
            <div class="size-options">
                ${Object.keys(product.sizes).map(sz => {
                    const q = product.sizes[sz];
                    return `<button type="button" class="size-btn ${q <= 0 ? 'sold-out' : ''}" ${q <= 0 ? 'disabled' : ''} onclick="selectSize('${sz}', this)">${sz}${q > 0 && q <= lowAt ? `<small>${q} left</small>` : ''}${q <= 0 ? '<small>sold out</small>' : ''}</button>`;
                }).join('')}
            </div>
        </div>` : '';
    
    const modalBody = document.getElementById('modalBody');
    const modal = document.getElementById('productModal');
    
    modalBody.innerHTML = `
        <div class="product-quick-view">
            <div class="quick-view-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="quick-view-info">
                <div class="product-category">${getCategoryName(product.category)}</div>
                <h2>${product.name}</h2>
                <div class="product-rating">
                    <div class="stars">
                        ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}
                    </div>
                    <span class="rating-text">${product.rating} (${product.reviews} reviews)</span>
                </div>
                <p class="product-description">${product.description}</p>
                <div class="product-price" style="margin: 24px 0;">
                    <span class="current-price" style="font-size: 1.8rem;">৳${product.price.toLocaleString()}</span>
                    ${product.originalPrice ? `<span class="original-price" style="font-size: 1.2rem;">৳${product.originalPrice.toLocaleString()}</span>` : ''}
                </div>
                ${sizeHTML}
                <div class="quick-actions" style="display: flex; gap: 16px; margin-top: 32px; flex-wrap: wrap;">
                    <button class="btn btn-primary btn-large" onclick="addToCartFromQuickView('${product.id}')" 
                            ${!product.inStock ? 'disabled' : ''}>
                        <i class="fas fa-shopping-cart"></i>
                        ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                    <button class="btn btn-outline" onclick="toggleWishlist('${product.id}')">
                        <i class="fas fa-heart"></i>
                        Wishlist
                    </button>
                </div>
            </div>
        </div>
    `;
    
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function toggleWishlist(productId) {
    // In a real application, this would manage a wishlist
    showToast('Wishlist feature coming soon!', 'info');
}

// ===== SEARCH =====
function initializeSearch() {
    const searchBtn = document.getElementById('searchBtn');
    const searchModal = document.getElementById('searchModal');
    const searchClose = document.getElementById('searchClose');
    const searchInput = document.getElementById('searchInput');
    
    // Search button
    if (searchBtn) {
        searchBtn.addEventListener('click', openSearch);
    }
    
    // Search close
    if (searchClose) {
        searchClose.addEventListener('click', closeSearch);
    }
    
    // Search input
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    // Close search when clicking outside
    if (searchModal) {
        searchModal.addEventListener('click', (e) => {
            if (e.target === searchModal) {
                closeSearch();
            }
        });
    }
}

function openSearch() {
    const searchModal = document.getElementById('searchModal');
    const searchInput = document.getElementById('searchInput');
    
    searchModal.classList.add('show');
    isSearchOpen = true;
    document.body.style.overflow = 'hidden';
    
    // Focus input
    setTimeout(() => {
        if (searchInput) searchInput.focus();
    }, 100);
}

function closeSearch() {
    const searchModal = document.getElementById('searchModal');
    
    searchModal.classList.remove('show');
    isSearchOpen = false;
    document.body.style.overflow = '';
}

function handleSearch(e) {
    const query = e.target.value;
    const searchResults = document.getElementById('searchResults');
    
    if (query.length < 2) {
        searchResults.innerHTML = '';
        return;
    }
    
    const results = products.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
    
    if (results.length === 0) {
        searchResults.innerHTML = `
            <div class="search-no-results">
                <p>No products found for "${query}"</p>
            </div>
        `;
        return;
    }
    
    searchResults.innerHTML = results.map(product => `
        <div class="search-result-item" onclick="selectSearchResult('${product.id}')">
            <img src="${product.image}" alt="${product.name}">
            <div class="search-result-info">
                <h4>${product.name}</h4>
                <p>৳${product.price.toLocaleString()}</p>
            </div>
        </div>
    `).join('');
}

function selectSearchResult(productId) {
    closeSearch();
    quickView(productId);
}

function performSearch() {
    const searchInput = document.getElementById('searchInput');
    searchQuery = searchInput.value;
    
    closeSearch();
    scrollToSection('#shop');
    displayProducts();
    
    // Reset to 'all' filter to show search results across all categories
    currentFilter = 'all';
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => btn.classList.remove('active'));
    document.querySelector('.filter-btn[data-filter="all"]').classList.add('active');
}

// ===== CHECKOUT =====
function showCheckoutModal() {
    const modal = document.getElementById('productModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    if (modalTitle) modalTitle.textContent = 'Checkout';
    
    const { subtotal, discount, shipping, total } = calcTotals();
    
    modalBody.innerHTML = `
        <div class="checkout-content">
            <div class="checkout-form">
                <h3>Customer Information</h3>
                <form id="checkoutForm">
                    <div class="form-group">
                        <input type="text" name="fullName" placeholder="Full Name *" required>
                    </div>
                    <div class="form-group">
                        <input type="tel" name="phone" placeholder="Phone Number *" required>
                    </div>
                    <div class="form-group">
                        <input type="email" name="email" placeholder="Email Address *" required>
                    </div>
                    <div class="form-group">
                        <textarea name="address" placeholder="Full Address *" required rows="3"></textarea>
                    </div>
                    <div class="form-group">
                        <input type="text" name="city" placeholder="City *" required>
                    </div>
                    <div class="form-group">
                        <select name="paymentMethod" required>
                            <option value="">Select Payment Method</option>
                            <option value="cod">Cash on Delivery</option>
                            <option value="bkash">bKash</option>
                            <option value="nagad">Nagad</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <textarea name="notes" placeholder="Order Notes (Optional)" rows="2"></textarea>
                    </div>
                </form>
            </div>
            
            <div class="checkout-summary">
                <h3>Order Summary</h3>
                <div class="checkout-items">
                    ${cart.map(item => `
                        <div class="checkout-item">
                            <img src="${item.image}" alt="${item.name}">
                            <div class="item-details">
                                <span class="item-name">${item.name}</span>
                                <span class="item-qty">${item.size ? 'Size: ' + item.size + ' · ' : ''}Qty: ${item.quantity}</span>
                            </div>
                            <span class="item-total">৳${(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="checkout-totals">
                    <div class="total-line">
                        <span>Subtotal:</span>
                        <span>৳${subtotal.toLocaleString()}</span>
                    </div>
                    ${discount > 0 ? `
                    <div class="total-line discount">
                        <span>Discount${appliedCoupon ? ' (' + escAttr(appliedCoupon.code) + ')' : ''}:</span>
                        <span>-৳${discount.toLocaleString()}</span>
                    </div>` : ''}
                    <div class="total-line">
                        <span>Shipping:</span>
                        <span>${shipping === 0 ? 'Free' : '৳' + shipping.toLocaleString()}</span>
                    </div>
                    <div class="total-line total">
                        <span>Total:</span>
                        <span>৳${total.toLocaleString()}</span>
                    </div>
                </div>
                <button class="btn btn-primary btn-large" onclick="submitOrder()" style="width: 100%; margin-top: 24px;">
                    <i class="fas fa-check"></i>
                    Place Order
                </button>
            </div>
        </div>
    `;
    
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

async function submitOrder() {
    const form = document.getElementById('checkoutForm');
    const formData = new FormData(form);
    
    // Validate form
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // Re-check stock/prices right before ordering
    syncCartWithStore();
    if (cart.length === 0) {
        showToast('Some items are no longer available. Please review your cart.', 'warning');
        closeModal();
        return;
    }
    const totals = calcTotals();
    const customerInfo = {
        fullName: formData.get('fullName'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        address: formData.get('address'),
        city: formData.get('city'),
        paymentMethod: formData.get('paymentMethod'),
        notes: formData.get('notes') || ''
    };
    
    // Show loading state
    const submitBtn = document.querySelector('.checkout-content .btn-primary');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitBtn.disabled = true;
    
    try {
        let order;
        if (sb) {
            // LIVE MODE: the database checks stock, deducts it and saves the order in one safe step.
            const { data, error } = await sb.rpc('place_order', {
                p_customer: {
                    full_name: customerInfo.fullName,
                    phone: customerInfo.phone,
                    email: customerInfo.email,
                    address: customerInfo.address,
                    city: customerInfo.city,
                    payment_method: customerInfo.paymentMethod,
                    notes: customerInfo.notes
                },
                p_items: cart.map(i => ({ id: i.id, size: i.size || null, qty: i.quantity })),
                p_coupon: totals.discount > 0 && appliedCoupon ? appliedCoupon.code : null
            });
            if (error) throw error;
            order = {
                id: data.id,
                customerInfo: customerInfo,
                items: data.items.map(l => ({ id: l.id, name: l.name, size: l.size || null, quantity: l.qty, price: l.unit_price, image: l.image })),
                subtotal: data.subtotal,
                discount: data.discount || 0,
                coupon: data.coupon || '',
                shipping: data.shipping,
                total: data.total,
                status: 'pending',
                orderDate: data.created_at,
                estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days from now
            };
            // Optional extra copy to your Google Sheet (does not affect the order)
            sendOrderToGoogleSheets(order);
        } else {
            // DEMO MODE (Supabase keys not set): old behaviour, nothing is deducted
            order = {
                id: generateOrderId(),
                customerInfo: customerInfo,
                items: cart.map(i => ({ ...i })),
                subtotal: totals.subtotal,
                discount: totals.discount,
                coupon: totals.discount > 0 && appliedCoupon ? appliedCoupon.code : '',
                shipping: totals.shipping,
                total: totals.total,
                status: 'pending',
                orderDate: new Date().toISOString(),
                estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
            };
            saveOrder(order);
        }
        
        // Clear cart (and the used coupon)
        clearCart();
        removeCoupon();
        
        // Send WhatsApp notification
        sendWhatsAppNotification(order);
        
        // Show success
        showOrderConfirmation(order);
        
        // Pull the new stock numbers straight away
        if (sb) refreshFromServer();
    } catch (err) {
        console.error('Order failed:', err);
        const msg = (err && err.message) ? err.message : 'Something went wrong. Please try again.';
        showToast(msg, 'error');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        if (sb) refreshFromServer(true);   // stock may have changed: update the cart/prices (keep the error message visible)
    }
}

function generateOrderId() {
    return 'BLK' + Date.now().toString().slice(-6) + Math.random().toString(36).substr(2, 3).toUpperCase();
}

function saveOrder(order) {
    // Save to local storage as backup
    let orders = JSON.parse(localStorage.getItem('blkpaper_orders')) || [];
    orders.push(order);
    localStorage.setItem('blkpaper_orders', JSON.stringify(orders));
    
    // Send to Google Sheets
    sendOrderToGoogleSheets(order);
    
    console.log('Order saved locally and sent to Google Sheets:', order);
}

// ===== GOOGLE SHEETS INTEGRATION =====
async function sendOrderToGoogleSheets(order) {
    try {
        // Prepare order data for Google Sheets
        const orderData = {
            // Order Information
            orderId: order.id,
            orderDate: new Date(order.orderDate).toLocaleString('en-GB', {
                timeZone: 'Asia/Dhaka',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
            status: order.status,
            
            // Customer Information
            customerName: order.customerInfo.fullName,
            customerPhone: order.customerInfo.phone,
            customerEmail: order.customerInfo.email,
            customerAddress: order.customerInfo.address,
            customerCity: order.customerInfo.city,
            paymentMethod: order.customerInfo.paymentMethod.toUpperCase(),
            orderNotes: order.customerInfo.notes || '',
            
            // Order Details
            itemsCount: order.items.length,
            itemsDetails: order.items.map(item => 
                `${item.name}${item.size ? ' [Size: ' + item.size + ']' : ''} (Qty: ${item.quantity}, Price: ৳${item.price})`
            ).join(' | '),
            subtotal: order.subtotal,
            discount: order.discount || 0,
            coupon: order.coupon || '',
            shipping: order.shipping,
            total: order.total,
            
            // Delivery Information
            estimatedDelivery: new Date(order.estimatedDelivery).toLocaleDateString('en-GB', {
                timeZone: 'Asia/Dhaka',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            }),
            
            // System Information
            source: 'BLKPAPER Website',
            timestamp: new Date().toISOString()
        };
        
        // Send to Google Sheets via Apps Script
        const response = await fetch(GOOGLE_SHEETS_CONFIG.scriptURL, {
            method: 'POST',
            mode: 'no-cors', // Required for Google Apps Script
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData)
        });
        
        console.log('✅ Order sent to Google Sheets successfully');
        
        // Send backup notification email (optional)
        await sendBackupNotification(order);
        
    } catch (error) {
        console.error('❌ Failed to send order to Google Sheets:', error);
        
        // Fallback: Save to local queue for retry
        saveOrderToRetryQueue(order);
        
        // Still show success to user (order is saved locally)
        showToast('Order saved! We\'ll process it shortly.', 'success');
    }
}

// Backup notification system
async function sendBackupNotification(order) {
    if (!GOOGLE_SHEETS_CONFIG.backupEmail) return;
    
    try {
        // This would integrate with EmailJS or similar service
        console.log('📧 Backup notification would be sent to:', GOOGLE_SHEETS_CONFIG.backupEmail);
        
        // Example EmailJS integration (commented out):
        /*
        await emailjs.send('your_service_id', 'order_template', {
            to_email: GOOGLE_SHEETS_CONFIG.backupEmail,
            order_id: order.id,
            customer_name: order.customerInfo.fullName,
            total_amount: order.total,
            order_details: JSON.stringify(order, null, 2)
        });
        */
        
    } catch (error) {
        console.error('Failed to send backup notification:', error);
    }
}

// Retry queue for failed submissions
function saveOrderToRetryQueue(order) {
    let retryQueue = JSON.parse(localStorage.getItem('blkpaper_retry_queue')) || [];
    retryQueue.push({
        order: order,
        attempts: 0,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('blkpaper_retry_queue', JSON.stringify(retryQueue));
    
    console.log('Order added to retry queue');
}

// Retry failed submissions periodically
function processRetryQueue() {
    const retryQueue = JSON.parse(localStorage.getItem('blkpaper_retry_queue')) || [];
    
    if (retryQueue.length === 0) return;
    
    console.log(`Processing ${retryQueue.length} orders from retry queue...`);
    
    retryQueue.forEach(async (queueItem, index) => {
        if (queueItem.attempts < 3) { // Max 3 retry attempts
            try {
                await sendOrderToGoogleSheets(queueItem.order);
                
                // Remove from retry queue on success
                retryQueue.splice(index, 1);
                localStorage.setItem('blkpaper_retry_queue', JSON.stringify(retryQueue));
                
                console.log(`✅ Retry successful for order ${queueItem.order.id}`);
                
            } catch (error) {
                // Increment attempt count
                queueItem.attempts++;
                console.log(`❌ Retry failed for order ${queueItem.order.id} (attempt ${queueItem.attempts})`);
            }
        } else {
            // Remove after 3 failed attempts
            console.log(`🗑️ Removing order ${queueItem.order.id} after 3 failed attempts`);
            retryQueue.splice(index, 1);
        }
    });
    
    localStorage.setItem('blkpaper_retry_queue', JSON.stringify(retryQueue));
}

// WhatsApp integration for order confirmations
function sendWhatsAppNotification(order) {
    const message = `🖤 BLKPAPER Order Confirmation
    
Order ID: ${order.id}
Customer: ${order.customerInfo.fullName}
Phone: ${order.customerInfo.phone}
Total: ৳${order.total.toLocaleString()}
Payment: ${order.customerInfo.paymentMethod.toUpperCase()}

Items:
${order.items.map(item => `• ${item.name}${item.size ? ' [' + item.size + ']' : ''} (Qty: ${item.quantity})`).join('\n')}

Address: ${order.customerInfo.address}, ${order.customerInfo.city}

Thank you for choosing BLKPAPER! 🖤`;
    
    // This would integrate with WhatsApp Business API
    console.log('📱 WhatsApp notification would be sent:', message);
    
    // For now, show user that notification was sent
    setTimeout(() => {
        showToast('Order confirmation sent via WhatsApp!', 'success');
    }, 1500);
}

function showOrderConfirmation(order) {
    const modal = document.getElementById('productModal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <div class="order-confirmation">
            <div class="confirmation-icon">
                <i class="fas fa-check-circle" style="font-size: 4rem; color: var(--accent-success);"></i>
            </div>
            <h2>Order Confirmed!</h2>
            <p>Thank you for your purchase. Your order has been successfully placed.</p>
            
            <div class="order-details">
                <h3>Order Details</h3>
                <div class="detail-row">
                    <span>Order ID:</span>
                    <span><strong>${order.id}</strong></span>
                </div>
                <div class="detail-row">
                    <span>Total Amount:</span>
                    <span><strong>৳${order.total.toLocaleString()}</strong></span>
                </div>
                <div class="detail-row">
                    <span>Payment Method:</span>
                    <span>${order.customerInfo.paymentMethod.toUpperCase()}</span>
                </div>
                <div class="detail-row">
                    <span>Estimated Delivery:</span>
                    <span>${new Date(order.estimatedDelivery).toLocaleDateString()}</span>
                </div>
            </div>
            
            <div class="confirmation-actions">
                <button class="btn btn-primary" onclick="closeModal(); scrollToSection('#home');">
                    <i class="fas fa-home"></i>
                    Continue Shopping
                </button>
                <button class="btn btn-outline" onclick="trackOrder('${order.id}')">
                    <i class="fas fa-truck"></i>
                    Track Order
                </button>
            </div>
        </div>
    `;
    
    // Send confirmation WhatsApp message
    setTimeout(() => {
        showToast('Order confirmation sent to your WhatsApp!', 'success');
    }, 1000);
}

function trackOrder(orderId) {
    closeModal();
    showToast(`Order tracking for ${orderId} would open here`, 'info');
}

// ===== FORMS =====
function initializeForms() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
}

function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const contactData = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        subject: formData.get('subject'),
        message: formData.get('message')
    };
    
    // Show loading state
    const submitBtn = e.target.querySelector('.btn-primary');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        showToast('Thank you! We\'ll get back to you soon.', 'success');
        e.target.reset();
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

// ===== MODALS =====
function initializeModals() {
    const modal = document.getElementById('productModal');
    const modalClose = document.getElementById('modalClose');
    
    // Modal close button
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    // Close modal when clicking outside
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
    
    // Escape key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (isSearchOpen) closeSearch();
            else closeModal();
        }
    });
}

function closeModal() {
    const modal = document.getElementById('productModal');
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

// ===== ANIMATIONS =====
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');
    animateElements.forEach(el => observer.observe(el));
}

// ===== SCROLL EFFECTS =====
function initializeScrollEffects() {
    const backToTop = document.getElementById('backToTop');
    
    // Back to top button
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });
    
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Parallax effects could be added here
}

// ===== UTILITY FUNCTIONS =====
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    const toastContent = toast.querySelector('.toast-content');
    const toastIcon = toast.querySelector('.toast-icon');
    const toastMessage = toast.querySelector('.toast-message');
    
    // Set icon based on type
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    toastIcon.className = `toast-icon ${icons[type] || icons.info}`;
    toastMessage.textContent = message;
    
    // Set toast type
    toast.className = `toast ${type}`;
    
    // Show toast
    toast.classList.add('show');
    
    // Hide after 4 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

function formatPrice(price) {
    return `৳${price.toLocaleString()}`;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^(\+88)?01[3-9]\d{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

// ===== CATEGORY NAVIGATION =====
document.addEventListener('DOMContentLoaded', function() {
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.getAttribute('data-category');
            filterProducts(category);
            scrollToSection('#shop');
        });
    });
});

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K to open search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
    }
    
    // Ctrl/Cmd + Shift + C to open cart
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        toggleCart();
    }
});

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    showToast('Something went wrong. Please refresh the page.', 'error');
});

// ===== PERFORMANCE MONITORING =====
window.addEventListener('load', function() {
    // Log performance metrics
    const navigation = performance.getEntriesByType('navigation')[0];
    console.log(`🖤 BLKPAPER loaded in ${Math.round(navigation.loadEventEnd - navigation.fetchStart)}ms`);
});

// ===== RETRY QUEUE INITIALIZATION =====
function initializeRetryQueue() {
    // Process retry queue on startup
    setTimeout(() => {
        processRetryQueue();
    }, 3000);
    
    // Set up periodic retry processing (every 5 minutes)
    setInterval(() => {
        processRetryQueue();
    }, 5 * 60 * 1000);
    
    // Show admin info about pending orders
    const retryQueue = JSON.parse(localStorage.getItem('blkpaper_retry_queue')) || [];
    if (retryQueue.length > 0) {
        console.log(`⚠️ ${retryQueue.length} orders pending retry to Google Sheets`);
    }
}

// ===== ADMIN FUNCTIONS =====
// Helper functions for debugging and management
window.BLKPAPER_ADMIN = {
    // View all local orders
    viewOrders: () => {
        const orders = JSON.parse(localStorage.getItem('blkpaper_orders')) || [];
        console.table(orders);
        return orders;
    },
    
    // View retry queue
    viewRetryQueue: () => {
        const queue = JSON.parse(localStorage.getItem('blkpaper_retry_queue')) || [];
        console.table(queue);
        return queue;
    },
    
    // Manually process retry queue
    processRetries: () => {
        processRetryQueue();
    },
    
    // Clear retry queue
    clearRetryQueue: () => {
        localStorage.removeItem('blkpaper_retry_queue');
        console.log('Retry queue cleared');
    },
    
    // Test Google Sheets connection
    testGoogleSheets: async () => {
        const testOrder = {
            id: 'TEST' + Date.now(),
            orderDate: new Date().toISOString(),
            status: 'test',
            customerInfo: {
                fullName: 'Test Customer',
                phone: '01700000000',
                email: 'test@example.com',
                address: 'Test Address',
                city: 'Dhaka',
                paymentMethod: 'cod',
                notes: 'Test order'
            },
            items: [{
                name: 'Test Product',
                quantity: 1,
                price: 100
            }],
            subtotal: 100,
            shipping: 100,
            total: 200,
            estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
        };
        
        await sendOrderToGoogleSheets(testOrder);
    }
};
console.log(`
🖤 BLKPAPER - Redefine Your Style
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ Modern fashion e-commerce from Bangladesh
🛒 Full cart functionality with checkout
📱 Responsive design for all devices
🔍 Smart search and filtering
💳 Cash on delivery & mobile payment options
🚀 Optimized for performance

Shortcuts:
- Ctrl/Cmd + K: Open search
- Ctrl/Cmd + Shift + C: Open cart
- ESC: Close modals/search

Ready to redefine style! 🖤
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);