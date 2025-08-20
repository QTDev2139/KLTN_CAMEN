import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import 'normalize.css';
import { renderRoutes } from './router/render.route';
import { routes } from './router/route.route';
import { SITE_SCREEN } from './router/path.route';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={SITE_SCREEN.HOME} replace />} />
        {renderRoutes(routes)}
      </Routes>
    </Router>
  );
}
