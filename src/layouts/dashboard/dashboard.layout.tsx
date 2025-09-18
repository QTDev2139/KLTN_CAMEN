import { Divider, Stack, useTheme } from '@mui/material';
import { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { STYLE } from '~/common/constant';
import { PADDING_GAP_LAYOUT } from '~/common/constant/style.constant';
import { TypographyHover } from '~/components/elements/styles/link.style';
import { StackRow } from '~/components/elements/styles/stack.style';
import Logo from '~/components/logo/logo';
import { sidebarsDashboard } from '~/pages/dashboard/path/sidebar-dashboard';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { palette } = useTheme();
  return (
    <StackRow sx={{ display: 'grid', gridTemplateColumns: '1fr 5fr' }}>
      <Stack sx={{ borderRight: `1px solid ${palette.divider}`, minHeight: '100vh',  }}>
        <Logo />
        <Divider sx={{ color: palette.divider }} />
        {sidebarsDashboard.map((sidebar, index) => {
          return (
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
              <TypographyHover variant="h4" sx={{ margin: '10px 20px' }}>
                {sidebar.title}
              </TypographyHover>
            </NavLink>
          );
        })}
      </Stack>
      <Stack sx={{ padding: `80px ${PADDING_GAP_LAYOUT}` }}>{children}</Stack>
    </StackRow>
  );
}
