// guards.tsx

import { Navigate } from 'react-router-dom';
import { UserType } from '~/apis/user/user.enum';
import { PATH } from '.';
import { ReactNode } from 'react';
import { CircularProgress, Stack } from '@mui/material';
import { useUserRole } from '~/hooks/use-user-role/use-user-role';



interface RoleGuardRouteProps {
  children: ReactNode;
  allowedRoles: UserType[];
}

export const RoleGuardRoute = ({ children, allowedRoles }: RoleGuardRouteProps) => {
  const { userRole, loading, hasAccess } = useUserRole();

  if (loading) {
    return (
      <Stack sx={{ minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Stack>
    );
  }

  // Nếu không có quyền, redirect về trang chủ
  if (!hasAccess(allowedRoles)) {
    return <Navigate to={`/${PATH.PAGE.ERROR}`} replace />;
  }

  return <>{children}</>;
};
