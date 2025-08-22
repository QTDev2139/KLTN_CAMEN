import 'i18next';
import { defaultNS, resources } from '~/i18n/i18n';

// Cài gợi ý trong t() 
declare module 'i18next' {
    // Kế thừa (thêm vào type)
    interface CustomTypeOptions {
        defaultNS: typeof defaultNS,
        resources: typeof resources['vi'],
    }
}