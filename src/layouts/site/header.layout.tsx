import { Cabin } from '@mui/icons-material';
import { Stack, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { STYLE } from '~/common/constant';
import AuthLink from '~/components/auth/auth-link.element';
import ContainerWrapper from '~/components/elements/container/container.element';
import { TypographyHover } from '~/components/elements/styles/link.style';
import { StackRow, StackRowJustBetweenAlignCenter, StackRowJustCenter } from '~/components/elements/styles/stack.style';
import Logo from '~/components/logo/logo';
import SearchInput from '~/components/search-input/search-input';
import { sidebars } from '~/pages/site/part/sidebar';

export default function Header() {
  const { palette } = useTheme();
  const { t } = useTranslation(['sidebar', 'user']);

  return (
    <Stack sx={{ boxShadow: '0 6px 4px 0 rgba(0, 0, 0, 0.09)' }}>
      <ContainerWrapper>
        <AuthLink/>
        <StackRowJustBetweenAlignCenter>
          <Logo />
          <SearchInput />
          <StackRowJustCenter sx={{ width: '260px' }}><Cabin /></StackRowJustCenter>
        </StackRowJustBetweenAlignCenter>
        <StackRow>
          {sidebars.map((sidebar, index) => {
            return (
              <NavLink
                key={index}
                to={sidebar.to}
                style={({ isActive }: { isActive: boolean }) => ({
                  padding: `0px ${STYLE.PADDING_GAP_ITEM}`,
                  color: isActive ? palette.primary.main : palette.text.primary,
                })}
              >
                <TypographyHover variant="subtitle1" style={{ paddingBottom: `${STYLE.PADDING_GAP_ITEM}` }}>
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
