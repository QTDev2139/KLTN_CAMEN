import 'normalize.css';
import '~/assets/App.css';
import '~/assets/fonts/Mulish/Mulish-VariableFont_wght.ttf';
import './i18n/i18n';
import { AuthProvider } from '~/common/auth/auth.context'; // Đảm bảo đúng path

import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { renderRoutes } from './router/render.route';
import { routes } from './router/route.route';
import { SITE_SCREEN } from './router/path.route';
import { ThemeProvider } from '@emotion/react';
import { theme } from './common/constant/mode.contant';
import { SnackbarProvider } from './hooks/use-snackbar/use-snackbar';
import { getLangPrefix } from './common/constant/get-lang-prefix';

export default function App() {
  const saved = localStorage.getItem('languages');
  const defaultLang: 'vi' | 'en' = saved === 'vi' || saved === 'en' ? saved : 'vi';

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider>
        <AuthProvider>
          <Router>
            <Routes>
              (<Route path="/" element={<Navigate to={getLangPrefix(defaultLang) + '/' + SITE_SCREEN.HOME} replace />} />
              {renderRoutes(routes)})
            </Routes>
          </Router>
        </AuthProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}
