export const PAGE = {
    // Public
    AUTH: 'auth/',
    ERROR: ':lang/error',
    NOT_FOUND: ':lang/*',

    // Private
    SITE: ':lang/' ,
    DASHBOARD: 'dashboard',
}

export const AUTH_SCREEN = {
    LOGIN: 'login'
}

export const SITE_SCREEN = {
    HOME: 'home',
    CATEGORY: 'c/:slug',
    PRODUCT: 'p/:slug',
    CART: 'cart',
    SUPPORT: 'support',
    BLOG: 'blog',
    BLOG_DETAIL: 'blog/:slug',
    ACCOUNT: 'account',
    // ACCOUNT_ORDERS: 'account_orders',
    CHECKOUT: 'checkout',
}

export const DASHBOARD_SCREEN = {
    OVERVIEW: 'overview',
    PRODUCT: 'product',
    ORDERS: 'orders',
    CUSTOMERS: 'customers',
    FEEDBACK: 'feedback',
    // FEEDBACK_REVIEWS: 'feedback_reviews',
    ANALYTICS: 'analytics',
    // SETTINGS: 'settings',
}