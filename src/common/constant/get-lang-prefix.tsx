export const getLangPrefix = (lang: 'vi' | 'en') => {
    return (lang === 'en' ? '/en' : '');
}
