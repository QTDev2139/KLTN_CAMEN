export const PAGE = {
    // Public
    // AUTH: '/',
    ERROR: '/error',
    NOT_FOUND: '/*',

    // Private
    SITE: '/' ,
    DASHBOARD: '/dashboard',
}

export const SITE_SCREEN = {
    HOME: 'home',
    CATEGORY: 'c/:slug',
    PRODUCT: 'p/:slug',
    CART: 'cart',
    SUPPORT: 'support',
    BLOG: 'blog',
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