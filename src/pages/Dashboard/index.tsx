import { Outlet } from 'react-router-dom';

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Outlet />
    </div>
  );
}
