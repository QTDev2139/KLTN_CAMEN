import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import BLOG_EN from '~/locates/en/blog.json';
import BLOG_VI from '~/locates/vi/blog.json';
import SIDEBAR_EN from '~/locates/en/sidebar.json';
import SIDEBAR_VI from '~/locates/vi/sidebar.json';
import ViIcon from '~/assets/images/vi_icon.png';
import EnIcon from '~/assets/images/en_icon.png';
import USER_EN from '~/locates/en/user.json';
import USER_VI from '~/locates/vi/user.json';
import LOGIN_VI from '~/locates/vi/login.json';
import LOGIN_EN from '~/locates/en/login.json';
import LOGOUT_VI from '~/locates/vi/logout.json';
import LOGOUT_EN from '~/locates/en/logout.json';
import FORGOT_PASSWORD_VI from '~/locates/vi/forgot-password.json';
import FORGOT_PASSWORD_EN from '~/locates/en/forgot-password.json';

export const locates = {
  vi: { label: 'Việt Nam', icon: ViIcon },
  en: { label: 'English', icon: EnIcon },
};

export const resources = {
  en: {
    blog: BLOG_EN,
    sidebar: SIDEBAR_EN,
    user: USER_EN,
    login: LOGIN_EN,
    logout: LOGOUT_EN,
    'forgot-password': FORGOT_PASSWORD_EN,
  },
  vi: {
    blog: BLOG_VI,
    sidebar: SIDEBAR_VI,
    user: USER_VI,
    login: LOGIN_VI,
    logout: LOGOUT_VI,
    'forgot-password': FORGOT_PASSWORD_VI,
  },
};

export const defaultNS = 'blog';
export const defaultLanguages = localStorage.getItem('languages')?.replace(/"/g, '') || 'vi';

i18n.use(initReactI18next).init({
  resources,
  ns: ['blog', 'sidebar', 'user', 'login', 'logout', 'forgot-password'], // translation, name space
  lng: defaultLanguages,
  defaultNS,
  fallbackLng: 'vi', // Khong xac dinh duoc ngon ngu => vi
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
