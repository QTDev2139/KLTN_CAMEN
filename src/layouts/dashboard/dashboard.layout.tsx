import { Divider, Stack, useTheme, CircularProgress, Avatar, Typography, Collapse, Box } from '@mui/material';
import { ChangeCircle } from '@mui/icons-material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { STYLE } from '~/common/constant';
import { PADDING_GAP_LAYOUT } from '~/common/constant/style.constant';
import { TypographyHover } from '~/components/elements/styles/link.style';
import { StackRow, StackRowAlignCenter } from '~/components/elements/styles/stack.style';
import { sidebarsDashboard, SidebarItem } from '~/pages/dashboard/path/sidebar-dashboard';
import { useUserRole } from '~/hooks/use-user-role/use-user-role';
import LogoDashboard from '~/components/logo/logo-dashboard';
import { User } from '~/apis/user/user.interfaces.api';
import { userApi } from '~/apis';
import { useSnackbar } from '~/hooks/use-snackbar/use-snackbar';
import { AUTH_SCREEN } from '~/router/path.route';
import LogoutIcon from '@mui/icons-material/Logout';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { palette } = useTheme();
  const { userRole, loading, hasAccess } = useUserRole();
  const [user, setUser] = useState<User | null>(null);
  const [openSub, setOpenSub] = useState<Record<string, boolean>>({});
  const handleToggleSub = (key: string) => {
    setOpenSub((s) => ({ ...s, [key]: !s[key] }));
  };
  const navigate = useNavigate();
  const { snackbar } = useSnackbar();

  useEffect(() => {
    (async () => {
      const profile = await userApi.getProfile();
      setUser(profile);
    })();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('resetToken');
    setUser(null);
    snackbar('success', 'Đăng xuất thành công');
    navigate(`/auth/${AUTH_SCREEN.LOGIN}`);
  };

  // Filter sidebar theo quyền user
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
    <StackRow sx={{ minHeight: '100vh', gap: 4, backgroundColor: 'background.default' }}>
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
        <LogoDashboard />
        <Divider sx={{ color: palette.divider }} />
        {/* Chỉ hiển thị sidebar user có quyền */}
        {visibleSidebars.map((sidebar, index) => {
          const key = sidebar.to ?? String(index);
          if (sidebar.children && sidebar.children.length) {
            return (
              <div key={key}>
                <StackRow
                  onClick={() => handleToggleSub(String(key))}
                  sx={{
                    cursor: 'pointer',
                    alignItems: 'center',
                    padding: `0 ${STYLE.PADDING_GAP_ITEM}`,
                    justifyContent: 'space-between',
                  }}
                >
                  <StackRowAlignCenter columnGap={1} sx={{ margin: '5px 10px' }}>
                    {sidebar.icon ? <Box component="span">{sidebar.icon}</Box> : null}
                    <Typography variant="h6">{sidebar.title}</Typography>
                  </StackRowAlignCenter>
                  {openSub[String(key)] ? <ExpandLess /> : <ExpandMore />}
                </StackRow>

                <Collapse in={Boolean(openSub[String(key)])} timeout="auto" unmountOnExit>
                  <Stack sx={{ pl: 2 }}>
                    {sidebar.children.map((child) => (
                      <NavLink
                        key={child.to}
                        to={child.to}
                        style={({ isActive }: { isActive: boolean }) => ({
                          padding: `0px ${STYLE.PADDING_GAP_ITEM}`,
                          color: isActive ? palette.primary.main : palette.text.primary,
                          textDecoration: 'none',
                        })}
                      >
                        <StackRowAlignCenter columnGap={1} sx={{ margin: '5px 10px', fontSize: '14px' }}>
                          {child.icon ? <Box component="span">{child.icon}</Box> : null}
                          <TypographyHover variant="h6" sx={{ fontSize: '14px' }}>
                            {child.title}
                          </TypographyHover>
                        </StackRowAlignCenter>
                      </NavLink>
                    ))}
                  </Stack>
                </Collapse>
              </div>
            );
          }

          return (
            <NavLink
              key={sidebar.to ?? index}
              to={sidebar.to}
              style={({ isActive }: { isActive: boolean }) => ({
                padding: `0px ${STYLE.PADDING_GAP_ITEM}`,
                color: isActive ? palette.primary.main : palette.text.primary,
                background: isActive ? palette.primary.light : 'transparent',
                transition: 'all 500ms ease',
              })}
            >
              <StackRowAlignCenter columnGap={1} sx={{ margin: '5px 10px' }}>
                {sidebar.icon ? <Box component="span">{sidebar.icon}</Box> : null}
                <TypographyHover variant="h6">{sidebar.title}</TypographyHover>
              </StackRowAlignCenter>
            </NavLink>
          );
        })}
        {user && (
          <Stack  sx={{ position: 'absolute', bottom: 40, paddingLeft: '20px', paddingTop: '20px', borderTop: `1px solid ${palette.divider}`, width: '230px',  }}>
            <StackRowAlignCenter columnGap={1} sx={{ py: 1 }}>
              <Avatar sx={{ width: 34, height: 34, bgcolor: palette.primary.main }}>
                {user.name.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="subtitle1" sx={{ color: palette.text.primary }}>
                {user.name}
              </Typography>
            </StackRowAlignCenter>

            <StackRowAlignCenter
              onClick={() => navigate('/auth/change-password')}
              sx={{
                cursor: 'pointer',
                color: 'text.secondary',
                '&:hover': { color: 'primary.main', transform: 'translateX(4px)' },
                transition: 'all 200ms ease',
                width: '200px',
                gap: 1,
                py: 1,
              }}
            >
              <ChangeCircle fontSize="small" />
              <Typography variant="body2">Đổi mật khẩu</Typography>
            </StackRowAlignCenter>
            <StackRowAlignCenter
              onClick={handleLogout}
              sx={{
                cursor: 'pointer',
                color: 'text.secondary',
                '&:hover': { color: 'primary.main', transform: 'translateX(4px)' },
                transition: 'all 200ms ease',
                width: '200px',
                gap: 1,
                py: 1,
              }}
            >
              <LogoutIcon fontSize="small" />
              <Typography variant="body2">Đăng xuất</Typography>
            </StackRowAlignCenter>
          </Stack>
        )}
      </Stack>
      <Stack
        sx={{
          padding: `20px ${PADDING_GAP_LAYOUT}`,
          width: 'calc(100% - 350px)',
          backgroundColor: 'background.default',
        }}
      >
        {children}
      </Stack>
    </StackRow>
  );
}
