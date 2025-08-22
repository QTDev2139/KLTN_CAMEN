import i18n from "i18next";
import { initReactI18next, Translation } from "react-i18next";
import BLOG_EN from '~/locates/en/blog.json'
import BLOG_VI from '~/locates/vi/blog.json'

export const resources = {
    en: {
        blog: BLOG_EN,
    },
    vi: {
        blog: BLOG_VI,
    }
}

export const defaultNS = 'blog';

i18n
    .use(initReactI18next)
    .init({
        resources,
        ns: ['blog'], // translation, name space
        lng: "vi",
        defaultNS,
        fallbackLng: "vi", // Khong xac dinh duoc ngon ngu => vi
        interpolation: {
            escapeValue: false
        }
    })

export default i18n;