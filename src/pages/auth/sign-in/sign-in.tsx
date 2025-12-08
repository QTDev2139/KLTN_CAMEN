import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Box, Button, Divider, TextField, Typography } from '@mui/material';
import { getIn } from 'formik';
import Logo from '~/components/logo/logo';
import { FONT_SIZE } from '~/common/constant/style.constant';

import { StackRowAlignCenter } from '~/components/elements/styles/stack.style';
import { Link, useNavigate } from 'react-router-dom';
import { AUTH_SCREEN, DASHBOARD_SCREEN, SITE_SCREEN } from '~/router/path.route';
import { useSnackbar } from '~/hooks/use-snackbar/use-snackbar';
import { BoxForm } from '~/components/elements/forms/box/box-form';
import { useAuth } from '~/common/auth/auth.context';
import { authApi } from '~/apis/auth/auth.api';
import { useLang } from '~/hooks/use-lang/use-lang';
import { getLangPrefix } from '~/common/constant/get-lang-prefix';
import { useTranslation } from 'react-i18next';

export interface FormRegister {
  email: string;
  password: string;
}

const schema = Yup.object({
  email: Yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
  password: Yup.string().required('Vui lòng mật khẩu'),
});

export default function LoginPage() {
  const { login } = useAuth();
  const { snackbar } = useSnackbar();
  const navigate = useNavigate();

  const { t } = useTranslation('login');

  // Lấy lang từ hook
  const currentLang = useLang();
  const prefix = getLangPrefix(currentLang);

  const formik = useFormik<FormRegister>({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: schema,
    onSubmit: async (values, { setSubmitting }) => {
      // setSubmitting: formik.isSubmitting sẽ được đặt thành true
      try {
        setSubmitting(true);
        await login(values.email, values.password);
        const me = await authApi.profile(); // lấy user mới nhất từ BE
        if (me.role?.name === 'customer') {
          navigate(`/${prefix}/${SITE_SCREEN.HOME}`, { replace: true });
        } else {
          navigate('/dashboard/' + DASHBOARD_SCREEN.OVERVIEW, { replace: true });
        }
      } catch (error: any) {
        // const resp = error?.response?.data;
        // let message = error?.message || 'Có lỗi xảy ra';

        // if (resp) {
        //   if (typeof resp === 'string') {
        //     message = resp;
        //   } else if (typeof resp.message === 'string') {
        //     message = resp.message;
        //   } else if (resp.errors) {
        //     if (Array.isArray(resp.errors)) {
        //       message = resp.errors.join(', ');
        //     } else if (typeof resp.errors === 'object') {
        //       message = Object.values(resp.errors).flat().join(', ');
        //     }
        //   }
        // }

        snackbar('error', "Tài khoản hoặc mật khẩu không đúng");
      } finally {
        setSubmitting(false);
      }
    },
  });

  /** Field helpers cho nested path */
  const showError = (path: string) => {
    const touched = getIn(formik.touched, path);
    const error = getIn(formik.errors, path);
    return (touched || formik.submitCount > 0) && Boolean(error);
  };
  const helperText = (path: string): React.ReactNode => (showError(path) ? getIn(formik.errors, path) : ' ');

  return (
    <Box component="form" onSubmit={formik.handleSubmit} noValidate>
      <BoxForm>
        <Logo />
        <Typography variant="h5" sx={{ textAlign: 'center', fontSize: FONT_SIZE.large, padding: '20px 0' }}>
          {t('title')}
        </Typography>

        <TextField
          label={t('email_placeholder')}
          fullWidth
          {...formik.getFieldProps('email')}
          error={showError('email')}
          helperText={helperText('email')}
        />
        <TextField
          label={t('password_placeholder')}
          type="password"
          fullWidth
          {...formik.getFieldProps('password')}
          error={showError('password')}
          helperText={helperText('password')}
        />
        <div style={{ width: '100%', position: 'relative' }}>
          <Link
            to={`${prefix}/auth/${AUTH_SCREEN.FORGOT_PW}`}
            replace
            style={{
              display: 'block',
              textAlign: 'end',
              fontSize: '14px',
              color: 'text.secondary',
              position: 'absolute',
              right: 0,
              top: -20,
            }}
          >
            {t('forgot_password')}
          </Link>
        </div>
        <Button type="submit" variant="contained" size="large" disabled={formik.isSubmitting} fullWidth>
          {formik.isSubmitting ? t('sign_in_button') : t('sign_in_button')}
        </Button>
        <StackRowAlignCenter sx={{ width: '100%' }}>
          <Divider sx={{ flex: 1 }} />
          <Typography sx={{ padding: '10px' }}>{t('or_separator')}</Typography>
          <Divider sx={{ flex: 1 }} />
        </StackRowAlignCenter>
        <StackRowAlignCenter sx={{ justifyContent: 'center' }}>
          <Typography sx={{ paddingRight: '6px' }}>{t('new_user_prompt')}</Typography>
          <Link to={`${prefix}/auth/${AUTH_SCREEN.SIGN_UP}`} replace>
            {t('create_account_link')}
          </Link>
        </StackRowAlignCenter>
      </BoxForm>
    </Box>
  );
}
