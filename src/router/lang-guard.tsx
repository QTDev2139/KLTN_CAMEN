// src/router/LangGuard.tsx
import { Navigate, Outlet, useParams } from 'react-router-dom';

const SUPPORTED_LANGS = ['', 'en'];

export default function LangGuard() {
  const { lang } = useParams();

  if (!lang || !SUPPORTED_LANGS.includes(lang)) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}
