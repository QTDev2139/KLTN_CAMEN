import { Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import i18n from "i18next";
import { PATH } from '~/router';

export default function BlogScreen() {
  const { t } = useTranslation('blog');
  const changeLanguage = (lng: 'en' | 'vi') => {
    i18n.changeLanguage(lng);
  }
  return (
    <>
      <Stack sx={{ padding: '20px 0' }}>
        <div onClick={() => changeLanguage('vi')}>Viet Nam</div>
        <div onClick={() => changeLanguage('en')}>English</div>
      </Stack>
      {t('title')}
      <Link to={PATH.SITE_SCREEN.HOME} >Home</Link>
    </>
  );
}
