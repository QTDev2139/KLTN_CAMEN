import { Stack, Typography, useTheme, Menu, MenuItem, IconButton, Avatar, Button } from '@mui/material';
import { StackRowAlignCenter, StackRowJustEnd } from '../elements/styles/stack.style';
import BtnSwitchLanguage from '../btn-switch-language/btn-switch-language';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { FONT_SIZE } from '~/common/constant/style.constant';
import { AUTH_SCREEN, DASHBOARD_SCREEN, PAGE, SITE_SCREEN } from '~/router/path.route';
import { useEffect, useState } from 'react';
import { userApi } from '~/apis';
import { useLang } from '~/hooks/use-lang/use-lang';
import { getLangPrefix } from '~/common/constant/get-lang-prefix';
import { useSnackbar } from '~/hooks/use-snackbar/use-snackbar';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LogoutIcon from '@mui/icons-material/Logout';
import { DashboardOutlined } from '@mui/icons-material';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { useProfile } from '~/hooks/use-profile/use-profile.hook';
import { getLimitLineCss } from '~/common/until/get-limit-line-css';

export default function AuthLink() {
  const { palette } = useTheme();
  const { t } = useTranslation('user');
  const navigate = useNavigate();
  const { snackbar } = useSnackbar();

  const { profile } = useProfile();

  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const currentLang = useLang();
  const prefix = getLangPrefix(currentLang);

  useEffect(() => {
    const fetchUser = async () => {
      if (profile?.name) {
        setUser({ name: profile.name, email: profile.email });
        setAuthChecked(true);
        return;
      }

      // Nếu không có access token thì không chờ API — hiện ngay phần login/sign up
      const token = localStorage.getItem('access_token');
      if (!token) {
        setUser(null);
        setAuthChecked(true);
        return;
      }

      try {
        const result = await userApi.getProfile();
        setUser({ name: result.name, email: result.email });
      } catch (error) {
        setUser(null);
      } finally {
        setAuthChecked(true);
      }
    };
    fetchUser();
  }, [profile]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('resetToken');
    setUser(null);
    setAnchorEl(null);
    snackbar('success', 'Đăng xuất thành công');
    navigate(`${prefix}/auth/${AUTH_SCREEN.LOGIN}`);
  };

  const handleOrders = () => {
    setAnchorEl(null);
    navigate(`${prefix}/${SITE_SCREEN.PURCHASE}`);
  };

  return (
    <Stack sx={{ width: '100%', paddingTop: '4px' }}>
      <StackRowJustEnd sx={{ alignItems: 'center' }}>
        <BtnSwitchLanguage />

        {!authChecked ? (
          // keep layout stable while checking auth — don't show login links yet
          <div style={{ width: 120 }} />
        ) : user ? (
          <>
            <Button
              onClick={handleClick}
              sx={{
                ml: 1,
                p: '5px',
                '&:hover': {
                  backgroundColor: 'transparent',
                },
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <Avatar sx={{ width: 24, height: 24, bgcolor: palette.primary.main }}>
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
                <Typography variant="body2" sx={{ color: palette.text.primary, maxWidth: 200, ...getLimitLineCss(1) }}>
                  {user.name}
                </Typography>
              </Stack>
            </Button>

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              PaperProps={{
                sx: {
                  mt: 1,
                  minWidth: 180,
                  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                },
              }}
            >
              <MenuItem
                onClick={handleOrders}
                sx={{
                  cursor: 'pointer',
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main', transform: 'translateX(4px)' },
                  transition: 'all 200ms ease',
                  width: '100%',
                  py: 1,
                }}
              >
                <StackRowAlignCenter onClick={handleOrders} gap={1}>
                  <ShoppingBagIcon fontSize="small" />
                  <Typography variant="body2">Đơn hàng</Typography>
                </StackRowAlignCenter>
              </MenuItem>
              <MenuItem
                onClick={handleLogout}
                sx={{
                  cursor: 'pointer',
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main', transform: 'translateX(4px)' },
                  transition: 'all 200ms ease',
                  width: '100%',
                  py: 1,
                }}
              >
                <StackRowAlignCenter onClick={handleLogout} gap={1}>
                  <LogoutIcon fontSize="small" />
                  <Typography variant="body2">Đăng xuất</Typography>
                </StackRowAlignCenter>
              </MenuItem>
              <MenuItem
                sx={{
                  cursor: 'pointer',
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main', transform: 'translateX(4px)' },
                  transition: 'all 200ms ease',
                  width: '100%',
                  py: 1,
                }}
              >
                <Link to={`${prefix}/auth/${AUTH_SCREEN.CHANGE_PASSWORD}`}>
                  <StackRowAlignCenter gap={1} sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
                    <VpnKeyIcon fontSize="small" />
                    <Typography variant="body2">Đổi mật khẩu</Typography>
                  </StackRowAlignCenter>
                </Link>
              </MenuItem>
              {profile?.role?.name !== 'customer' && (
                <MenuItem
                  sx={{
                    cursor: 'pointer',
                    color: 'text.secondary',
                    '&:hover': { color: 'primary.main', transform: 'translateX(4px)' },
                    transition: 'all 200ms ease',
                    width: '100%',
                    py: 1,
                  }}
                >
                  <Link
                    to={PAGE.DASHBOARD + '/' + DASHBOARD_SCREEN.OVERVIEW}
                    style={{ color: palette.text.primary, fontSize: FONT_SIZE.small }}
                  >
                    <StackRowAlignCenter gap={1} sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
                      <DashboardOutlined fontSize="small" />
                      <Typography variant="body2">Vào Dashboard</Typography>
                    </StackRowAlignCenter>
                  </Link>
                </MenuItem>
              )}
            </Menu>
          </>
        ) : (
          <Typography variant="body1" style={{ padding: '0 10px' }}>
            <Link
              to={`${prefix}/auth/${AUTH_SCREEN.LOGIN}`}
              style={{ color: palette.text.primary, fontSize: FONT_SIZE.small }}
            >
              {t('login')}
            </Link>
            {/* <span style={{ padding: '0 4px' }}>/</span>
            <Link
              to={`${prefix}/auth/${AUTH_SCREEN.SIGN_UP}`}
              style={{ color: palette.text.primary, fontSize: FONT_SIZE.small }}
            >
              {t('sign_up')}
            </Link> */}
          </Typography>
        )}
      </StackRowJustEnd>
    </Stack>
  );
}
