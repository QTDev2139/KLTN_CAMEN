export const PAGE = {
    // Public
    AUTH: ':lang/auth/',
    ERROR: ':lang/error',
    NOT_FOUND: ':lang/*',

    // Private
    SITE: ':lang/' ,
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
    PRODUCT: 'p/:slug',
    CART: 'cart',
    CONTACT: 'contact',
    BLOG: 'blog',
    BLOG_DETAIL: 'blog/:slug',
    ACCOUNT: 'account',
    // ACCOUNT_ORDERS: 'account_orders',
    CHECKOUT: 'checkout',
}

export const DASHBOARD_SCREEN = {
    OVERVIEW: 'overview',
    ORDERS: 'orders',
    PRODUCT: 'product',
    CUSTOMERS: 'customers',
    BLOG: 'blog',
    COUPON: 'coupon',
    REVIEWS: 'review',
    // ANALYTICS: 'analytics',
    // SETTINGS: 'settings',
}