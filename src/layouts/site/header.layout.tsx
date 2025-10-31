import React from 'react';
import { Cabin } from '@mui/icons-material';
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

export default function Header() {
  const { palette } = useTheme();
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

  return (
    <Stack sx={{ position: 'relative', zIndex: 100, boxShadow: '0 6px 4px 0 rgba(0, 0, 0, 0.09)' }}>
      <ContainerWrapper>
        <AuthLink />
        <StackRowJustBetweenAlignCenter>
          <Logo />
          <SearchInput />
          <StackRowJustCenter sx={{ width: '260px' }}>
            {/* Cart */}
            <Link to={`${prefix}/${SITE_SCREEN.CART}`}>
              <Cabin />
            </Link>
          </StackRowJustCenter>
        </StackRowJustBetweenAlignCenter>
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
      </ContainerWrapper>
    </Stack>
  );
}
