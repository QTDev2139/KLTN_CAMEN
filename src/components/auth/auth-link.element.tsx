import { Stack, Typography, useTheme } from '@mui/material';
import { StackRowJustEnd } from '../elements/styles/stack.style';
import BtnSwitchLanguage from '../btn-switch-language/btn-switch-language';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FONT_SIZE } from '~/common/constant/style.constant';
import { AUTH_SCREEN } from '~/router/path.route';
import { useEffect, useState } from 'react';
import { userApi } from '~/apis';
import { useLang } from '~/hooks/use-lang/use-lang';
import { getLangPrefix } from '~/common/constant/get-lang-prefix';

export default function AuthLink() {
  const { palette } = useTheme();
  const { t } = useTranslation('user');

  const [user, setUser] = useState(null);

  const currentLang = useLang();
  const prefix = getLangPrefix(currentLang);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await userApi.getProfile();
        setUser(result.name);
      } catch (error) {
        // User chưa đăng nhập
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  return (
    <Stack sx={{ width: '100%', paddingTop: '4px' }}>
      <StackRowJustEnd sx={{ alignItems: 'center' }}>
        <BtnSwitchLanguage />
        {user ? (
          <Typography variant="body1" style={{ padding: '0 10px' }}>
            {user}
          </Typography>
        ) : (
          <Typography variant="body1" style={{ padding: '0 10px' }}>
            {/* ✅ ĐÚNG - dùng prefix nhất quán, có dấu / giữa prefix và path */}
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
