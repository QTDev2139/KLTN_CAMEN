export const PAGE = {
    // Public
    AUTH: 'auth',
    ERROR: 'error',
    NOT_FOUND: '*',

    // Private
    SITE: '', 
    DASHBOARD: 'dashboard',
}

export const AUTH_SCREEN = {
    LOGIN: 'login',
    SIGN_UP: 'sign-up',
    FORGOT_PW: 'forgot-password',
}

export const SITE_SCREEN = {
    HOME: 'home',
    CATEGORY: 'c/:slug',
    PRODUCT: {
        ROOT: 'product',
        DOMESTIC: 'product-domestic',
        DOMESTIC_DETAIL: 'product-domestic/:slug',
        EXPORT: 'product-export',    
        DETAIL: 'product/:slug',
    },
    PRODUCT_DETAIL: 'product/:slug',
    CART: 'cart',
    CONTACT: 'contact',
    BLOG: 'blog',
    BLOG_DETAIL: 'blog/:slug',
    ACCOUNT: 'account',
    // ACCOUNT_ORDERS: 'account_orders',
    CHECKOUT: 'checkout',
    ORDER: 'order',
    ORDER_DETAIL: 'order/:id',
    PURCHASE: 'purchase',
    PAYMENT_CALLBACK: 'payment-callback',
    COD_CONFIRMATION: 'cod-confirmation',
}

export const DASHBOARD_SCREEN = {
    OVERVIEW: 'overview',
    ORDERS: 'orders',
    PRODUCT: 'product',
    CONTACT: 'contact',
    CUSTOMERS: 'customers',
    BLOG: {
        BLOG_VIEW: 'blog-view',
        BLOG_CATEGORY: 'blog-categories',
    },
    COUPON: 'coupon',
    REVIEWS: 'review',
    CHATBOX: 'chatbox',
    // ANALYTICS: 'analytics',
    // SETTINGS: 'settings',
    IMPORT_PRODUCT: 'import-product',
}