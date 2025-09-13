import 'normalize.css';
import '~/assets/App.css';
import '~/assets/fonts/Mulish/Mulish-VariableFont_wght.ttf';
import './i18n/i18n';
import { AuthProvider } from '~/pages/auth/auth-context/AuthContext'; // Đảm bảo đúng path

import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { renderRoutes } from './router/render.route';
import { routes } from './router/route.route';
import { SITE_SCREEN } from './router/path.route';
import { ThemeProvider } from '@emotion/react';
import { theme } from './common/constant/mode.contant';

export default function App() {
  const saved = localStorage.getItem('languages');
  const language: 'vi' | 'en' = saved === 'vi' || saved === 'en' ? saved : 'vi';
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to={language + '/' + SITE_SCREEN.HOME} replace />} />
            {renderRoutes(routes)}
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
