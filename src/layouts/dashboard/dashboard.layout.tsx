import { Divider, Stack, useTheme, CircularProgress } from '@mui/material';
import { ReactNode, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { STYLE } from '~/common/constant';
import { PADDING_GAP_LAYOUT } from '~/common/constant/style.constant';
import { TypographyHover } from '~/components/elements/styles/link.style';
import { StackRow } from '~/components/elements/styles/stack.style';
import Logo from '~/components/logo/logo';
import { sidebarsDashboard, SidebarItem } from '~/pages/dashboard/path/sidebar-dashboard';
import { useUserRole } from '~/hooks/use-user-role/use-user-role';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { palette } = useTheme();
  const { userRole, loading, hasAccess } = useUserRole();

  // ✅ Filter sidebar theo quyền user
  const visibleSidebars = useMemo(() => {
    if (!userRole) return [];
    return sidebarsDashboard.filter((sidebar: SidebarItem) => hasAccess(sidebar.allowUserTypes));
  }, [userRole, hasAccess]);


  if (loading) {
    return (
      <Stack sx={{ minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <StackRow sx={{ minHeight: '100vh', gap: 4, backgroundColor: 'background.paper' }}>
      <Stack 
        sx={{ 
          borderRight: `1px solid ${palette.divider}`, 
          height: '100vh',
          position: 'sticky', 
          top: 0,
          left: 0,
          overflowY: 'auto',
          width: '250px',
          maxWidth: '250px',
          backgroundColor: 'background.default',
        }}
      >
        <Logo />
        <Divider sx={{ color: palette.divider }} />
        {/* ✅ Chỉ hiển thị sidebar user có quyền */}
        {visibleSidebars.map((sidebar, index) => (
          <NavLink
            key={index}
            to={sidebar.to}
            style={({ isActive }: { isActive: boolean }) => ({
              padding: `0px ${STYLE.PADDING_GAP_ITEM}`,
              color: isActive ? palette.primary.main : palette.text.primary,
              background: isActive ? palette.primary.light : 'transparent',
              transition: 'all 500ms ease',
            })}
          >
            <TypographyHover variant="h6" sx={{ margin: '5px 10px' }}>
              {sidebar.title}
            </TypographyHover>
          </NavLink>
        ))}
      </Stack>
      <Stack sx={{ padding: `20px ${PADDING_GAP_LAYOUT}`, width: 'calc(100% - 250px)', backgroundColor: 'background.default' }}>{children}</Stack>
    </StackRow>
  );
}
