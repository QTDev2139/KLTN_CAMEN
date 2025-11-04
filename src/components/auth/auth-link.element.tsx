import { Stack, Typography, useTheme, Menu, MenuItem, IconButton, Avatar, Button } from '@mui/material';
import { StackRowJustEnd } from '../elements/styles/stack.style';
import BtnSwitchLanguage from '../btn-switch-language/btn-switch-language';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { FONT_SIZE } from '~/common/constant/style.constant';
import { AUTH_SCREEN, SITE_SCREEN } from '~/router/path.route';
import { useEffect, useState } from 'react';
import { userApi } from '~/apis';
import { useLang } from '~/hooks/use-lang/use-lang';
import { getLangPrefix } from '~/common/constant/get-lang-prefix';
import { useSnackbar } from '~/hooks/use-snackbar/use-snackbar';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LogoutIcon from '@mui/icons-material/Logout';

export default function AuthLink() {
  const { palette } = useTheme();
  const { t } = useTranslation('user');
  const navigate = useNavigate();
  const { snackbar } = useSnackbar();

  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const currentLang = useLang();
  const prefix = getLangPrefix(currentLang);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await userApi.getProfile();
        setUser({ name: result.name, email: result.email });
      } catch (error) {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setAnchorEl(null);
    snackbar('success',  'Đăng xuất thành công');
    navigate(`${prefix}/auth/${AUTH_SCREEN.LOGIN}`);
  };

  const handleOrders = () => {
    setAnchorEl(null);
    navigate(`${prefix}/${SITE_SCREEN.ORDER}`);
  };

  return (
    <Stack sx={{ width: '100%', paddingTop: '4px' }}>
      <StackRowJustEnd sx={{ alignItems: 'center' }}>
        <BtnSwitchLanguage />
        
        {user ? (
          <>
            <Button
              onClick={handleClick}
              sx={{
                ml: 1,
                p: '5px 20px',
                '&:hover': {
                  backgroundColor: 'transparent',
                },
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <Avatar sx={{ width: 24, height: 24, bgcolor: palette.primary.main }}>
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
                <Typography variant="body2" sx={{ color: palette.text.primary }}>
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
              <MenuItem onClick={handleOrders} sx={{ py: 1.5 }}>
                <ShoppingBagIcon sx={{ mr: 1.5, fontSize: 20 }} />
                <Typography variant="body2">{ 'Đơn hàng'}</Typography>
              </MenuItem>
              <MenuItem onClick={handleLogout} sx={{ py: 1.5, color: palette.error.main }}>
                <LogoutIcon sx={{ mr: 1.5, fontSize: 20 }} />
                <Typography variant="body2">{ 'Đăng xuất'}</Typography>
              </MenuItem>
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
            <span style={{ padding: '0 4px' }}>/</span>
            <Link
              to={`${prefix}/auth/${AUTH_SCREEN.SIGN_UP}`}
              style={{ color: palette.text.primary, fontSize: FONT_SIZE.small }}
            >
              {t('sign_up')}
            </Link>
          </Typography>
        )}
      </StackRowJustEnd>
    </Stack>
  );
}
