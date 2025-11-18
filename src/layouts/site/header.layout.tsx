import React from 'react';
import { ShoppingCart } from '@mui/icons-material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Stack, useTheme, Button, Menu } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link, NavLink } from 'react-router-dom';
import { STYLE } from '~/common/constant';
import AuthLink from '~/components/auth/auth-link.element';
import ContainerWrapper from '~/components/elements/container/container.element';
import { TypographyHover } from '~/components/elements/styles/link.style';
import { StackRow, StackRowJustBetweenAlignCenter, StackRowJustCenter } from '~/components/elements/styles/stack.style';
import Logo from '~/components/logo/logo';
import SearchInput from '~/components/search-input/search-input';
import { sidebars } from '~/pages/site/part/sidebar';
import { SITE_SCREEN } from '~/router/path.route';
import { useLang } from '~/hooks/use-lang/use-lang';
import { getLangPrefix } from '~/common/constant/get-lang-prefix';

// mobile
import useMediaQuery from '@mui/material/useMediaQuery';
import { IconButton, Drawer, List, ListItem, ListItemButton, ListItemText, Collapse, Divider, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';

export default function Header() {
  const { palette, breakpoints } = useTheme();
  const { t } = useTranslation(['sidebar', 'user']);

  // Lấy lang từ hook
  const currentLang = useLang();
  const prefix = getLangPrefix(currentLang);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Mobile drawer state
  const isMobile = useMediaQuery(breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const toggleDrawer = (openState: boolean) => () => setDrawerOpen(openState);

  // track open submenus inside drawer
  const [openSub, setOpenSub] = React.useState<Record<string, boolean>>({});
  const handleToggleSub = (key: string) => {
    setOpenSub((s) => ({ ...s, [key]: !s[key] }));
  };

  return (
    <Stack sx={{ position: 'relative', zIndex: 100, boxShadow: '0 6px 4px 0 rgba(0, 0, 0, 0.09)' }}>
      <ContainerWrapper>
        {/* Desktop: AuthLink shown as before; Mobile: keep in drawer */}
        {!isMobile ? <AuthLink /> : null}

        {/* Top row: responsive */}
        {!isMobile ? (
          <StackRowJustBetweenAlignCenter>
            <Logo />
            <SearchInput />
            <StackRowJustCenter sx={{ width: '260px' }}>
              {/* Cart */}
              <Link to={`${prefix}/${SITE_SCREEN.CART}`} style={{ color: palette.text.primary }}>
                <ShoppingCart />
              </Link>
            </StackRowJustCenter>
          </StackRowJustBetweenAlignCenter>
        ) : (
          // Mobile header: menu, logo, cart (+ optional search icon)
          <StackRowJustBetweenAlignCenter>
            <IconButton aria-label="menu" size="large" onClick={toggleDrawer(true)} sx={{ color: palette.text.primary }}>
              <MenuIcon />
            </IconButton>

            <Logo />

            <Stack direction="row" spacing={1} alignItems="center">
              <Link to={`${prefix}/${SITE_SCREEN.CART}`} style={{ color: palette.text.primary }}>
                <ShoppingCart />
              </Link>
            </Stack>
          </StackRowJustBetweenAlignCenter>
        )}

        {/* Desktop navigation (unchanged) */}
        {!isMobile && (
          <StackRow>
            {sidebars.map((sidebar, index) => {
              if ('children' in sidebar && sidebar.children?.length) {
                return (
                  <Stack key={sidebar.to ?? index}>
                    <Button
                      id="basic-button"
                      aria-controls={open ? 'basic-menu' : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? 'true' : undefined}
                      onClick={handleClick}
                      sx={{
                        padding: 0,
                        color: palette.text.primary,
                        '&:hover': {
                          backgroundColor: 'transparent',
                          boxShadow: 'none',
                        },
                      }}
                    >
                      <TypographyHover
                        variant="h6"
                        style={{ paddingBottom: `${STYLE.PADDING_GAP_ITEM}`, display: 'flex', alignItems: 'center', fontSize: '16px' }}
                      >
                        {t(sidebar.title)} {open ? <ExpandLess /> : <ExpandMore />}
                      </TypographyHover>
                    </Button>

                    <Menu id="basic-menu" anchorEl={anchorEl} open={open} onClose={handleClose} onClick={handleClose}>
                      {sidebar.children.map((item) => (
                        <Stack key={item.to}>
                          <NavLink
                            to={`${prefix}/${item.to}`}
                            style={({ isActive }: { isActive: boolean }) => ({
                              padding: `0px ${STYLE.PADDING_GAP_ITEM}`,
                              color: isActive ? palette.primary.main : palette.text.primary,
                              textDecoration: 'none',
                            })}
                          >
                            <TypographyHover variant="h6" sx={{ justifyContent: 'flex-start', fontSize: '16px' }}>
                              {t(item.title)}
                            </TypographyHover>
                          </NavLink>
                        </Stack>
                      ))}
                    </Menu>
                  </Stack>
                );
              }

              return (
                <NavLink
                  key={sidebar.to ?? index}
                  to={`${prefix}/${sidebar.to}`}
                  style={({ isActive }: { isActive: boolean }) => ({
                    padding: `0px ${STYLE.PADDING_GAP_ITEM}`,
                    color: isActive ? palette.primary.main : palette.text.primary,
                    textDecoration: 'none',
                  })}
                >
                  <TypographyHover variant="h6" style={{ paddingBottom: `${STYLE.PADDING_GAP_ITEM}`, fontSize: '16px' }}>
                    {t(sidebar.title)}
                  </TypographyHover>
                </NavLink>
              );
            })}
          </StackRow>
        )}

        {/* Mobile Drawer with navigation */}
        <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
          <Box sx={{ width: 280 }} role="presentation">
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 1 }}>
              <Box><Logo /></Box>
              <IconButton aria-label="close" onClick={toggleDrawer(false)}>
                <CloseIcon />
              </IconButton>
            </Stack>
            <Divider />
            {/* Optionally show AuthLink in drawer for mobile */}
            <Box sx={{ px: 1 }}>{isMobile ? <AuthLink /> : null}</Box>
            <List>
              {sidebars.map((sidebar) => {
                const key = sidebar.to ?? sidebar.title;
                if ('children' in sidebar && sidebar.children?.length) {
                  return (
                    <Box key={key}>
                      <ListItem disablePadding>
                        <ListItemButton onClick={() => handleToggleSub(String(key))}>
                          <ListItemText primary={t(sidebar.title)} />
                          {openSub[String(key)] ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                      </ListItem>
                      <Collapse in={Boolean(openSub[String(key)])} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                          {sidebar.children.map((item) => (
                            <ListItem key={item.to} disablePadding>
                              <NavLink
                                to={`${prefix}/${item.to}`}
                                onClick={toggleDrawer(false)}
                                style={({ isActive }: { isActive: boolean }) => ({
                                  textDecoration: 'none',
                                  color: isActive ? palette.primary.main : palette.text.primary,
                                  width: '100%',
                                })}
                              >
                                <ListItemButton sx={{ pl: 4 }}>
                                  <ListItemText primary={t(item.title)} />
                                </ListItemButton>
                              </NavLink>
                            </ListItem>
                          ))}
                        </List>
                      </Collapse>
                    </Box>
                  );
                }

                return (
                  <ListItem key={sidebar.to} disablePadding>
                    <NavLink
                      to={`${prefix}/${sidebar.to}`}
                      onClick={toggleDrawer(false)}
                      style={({ isActive }: { isActive: boolean }) => ({
                        textDecoration: 'none',
                        color: isActive ? palette.primary.main : palette.text.primary,
                        width: '100%',
                      })}
                    >
                      <ListItemButton>
                        <ListItemText primary={t(sidebar.title)} />
                      </ListItemButton>
                    </NavLink>
                  </ListItem>
                );
              })}
            </List>
            <Divider />
            {/* Footer area inside drawer: quick links */}
            <Box sx={{ p: 2 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <SearchIcon />
                {/* <Link to={`${prefix}/search`} style={{ textDecoration: 'none', color: palette.text.primary }}>
                  {t('sidebar:search') || 'Tìm kiếm'}
                </Link> */}
              </Stack>
            </Box>
          </Box>
        </Drawer>
      </ContainerWrapper>
    </Stack>
  );
}
