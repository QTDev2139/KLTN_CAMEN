import { Stack, Typography, useTheme } from '@mui/material';
import { StackRowJustEnd } from '../elements/styles/stack.style';
import BtnSwitchLanguage from '../btn-switch-language/btn-switch-language';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { FONT_SIZE } from '~/common/constant/style.constant';
import { AUTH_SCREEN } from '~/router/path.route';
import { useEffect, useState } from 'react';
import { userApi } from '~/apis';

export default function AuthLink() {
  const { palette } = useTheme();
  const { lang } = useParams();
  const { t } = useTranslation('user');

  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async() => {
      const result = await userApi.getProfile();
      setUser(result.name);
    }
    fetchUser();
  }, [])

  return (
    <Stack sx={{ width: '100%', paddingTop: '4px' }}>
      <StackRowJustEnd sx={{ alignItems: 'center' }}>
        <BtnSwitchLanguage />
        {user ? (
          <Typography variant='body1' style={{ padding: '0 10px' }}>{user}</Typography>
        ) : (
          <Typography variant="body1" style={{ padding: '0 10px' }}>
            <Link
              to={`/${lang}/auth/${AUTH_SCREEN.LOGIN}`}
              replace
              style={{ color: palette.text.primary, fontSize: FONT_SIZE.small }}
            >
              {t('login')}
            </Link>
            <span style={{ padding: '0 4px' }}>/</span>
            <Link
              to={`/${lang}/auth/${AUTH_SCREEN.SIGN_UP}`}
              replace
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
