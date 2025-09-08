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

export const locates = {
  vi: { label: 'Việt Nam', icon: ViIcon },
  en: { label: 'English', icon: EnIcon },
};

export const resources = {
  en: {
    blog: BLOG_EN,
    sidebar: SIDEBAR_EN,
    user: USER_EN,
  },
  vi: {
    blog: BLOG_VI,
    sidebar: SIDEBAR_VI,
    user: USER_VI,
  },
};

export const defaultNS = 'blog';
export const defaultLanguages = localStorage.getItem('languages')?.replace(/"/g, '') || 'vi';

i18n.use(initReactI18next).init({
  resources,
  ns: ['blog', 'sidebar', 'user'], // translation, name space
  lng: defaultLanguages,
  defaultNS,
  fallbackLng: 'vi', // Khong xac dinh duoc ngon ngu => vi
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
