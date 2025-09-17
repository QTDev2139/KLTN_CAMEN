// guards.tsx

import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { UserType } from '~/apis/user/user.enum';
import { useAuth } from '~/common/auth/auth.context';
import { PATH } from '.';
import { PAGE } from './path.route';

// 👇 Lấy lang nếu có
function useLang() {
  const { lang } = useParams();
  return lang || localStorage.getItem('languages') || 'vi';
}

/**
 * Chặn khách hàng (role_id === 4) truy cập dashboard
 * Chặn admin/staff truy cập trang client (vi/...)
 */
export function RoleGuardRoute({
  allow,
  children,
}: {
  allow: number[]; // danh sách role_id được cho phép
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const lang = useLang();

  if (loading) return null;
  
  // Chưa login
  if (!user) {
    return <Navigate to={`/${lang}/home`} replace />;
  }

  // Nếu đã login nhưng role không được phép → chuyển trang phù hợp
  if (!allow.includes(user.role_id)) {
    return user.role_id === UserType.CUSTOMER ? (
      <Navigate to={`/${lang}/${PATH.SITE_SCREEN.HOME}`} replace />
    ) : (
      <Navigate to={`/${PAGE.DASHBOARD}/${PATH.DASHBOARD_SCREEN.OVERVIEW}`} replace />
    );
  }

  return <>{children}</>;
}
