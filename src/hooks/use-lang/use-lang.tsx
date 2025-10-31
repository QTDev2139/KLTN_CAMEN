import { useLocation } from 'react-router-dom';

export const useLang = (): 'vi' | 'en' => {
  const location = useLocation();
  
  if (location.pathname.startsWith('/en')) {
    return 'en';
  }
  
  const saved = localStorage.getItem('languages');
  if (saved === 'en') {
    return 'en';
  }
  
  return 'vi';
};