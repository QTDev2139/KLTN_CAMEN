import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import 'normalize.css';
import { renderRoutes } from './router/render.route';
import { routes } from './router/route.route';
import { PAGE } from './router/path.route';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={PAGE.HOME} replace />} />
        {renderRoutes(routes)}
      </Routes>
    </Router>
  );
}
