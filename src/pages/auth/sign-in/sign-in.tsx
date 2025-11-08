import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Box, Button, Divider, TextField, Typography } from '@mui/material';
import { getIn } from 'formik';
import Logo from '~/components/logo/logo';
import { FONT_SIZE } from '~/common/constant/style.constant';

import { StackRowAlignCenter } from '~/components/elements/styles/stack.style';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AUTH_SCREEN, DASHBOARD_SCREEN, SITE_SCREEN } from '~/router/path.route';
import { useSnackbar } from '~/hooks/use-snackbar/use-snackbar';
import { BoxForm } from '~/components/elements/forms/box/box-form';
import { useAuth } from '~/common/auth/auth.context';
import { authApi } from '~/apis/auth/auth.api';
import { useLang } from '~/hooks/use-lang/use-lang';
import { getLangPrefix } from '~/common/constant/get-lang-prefix';

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
        const message = error?.response?.data?.message || 'Tài khoản mật khẩu không chính xác';
        snackbar('error', message);
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
          Sign in to CamenFood
        </Typography>

        <TextField
          label="Email"
          fullWidth
          {...formik.getFieldProps('email')}
          error={showError('email')}
          helperText={helperText('email')}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          {...formik.getFieldProps('password')}
          error={showError('password')}
          helperText={helperText('password')}
        />

        <Button type="submit" variant="contained" size="large" disabled={formik.isSubmitting} fullWidth>
          {formik.isSubmitting ? 'Đang gửi…' : 'Sign in'}
        </Button>
        <StackRowAlignCenter sx={{ width: '100%' }}>
          <Divider sx={{ flex: 1 }} />
          <Typography sx={{ padding: '10px' }}>or</Typography>
          <Divider sx={{ flex: 1 }} />
        </StackRowAlignCenter>
        <StackRowAlignCenter sx={{ justifyContent: 'center' }}>
          <Typography sx={{ paddingRight: '6px' }}>New to CamenFood?</Typography>
          <Link to={`/${prefix}/auth/${AUTH_SCREEN.SIGN_UP}`} replace>
            Create an account
          </Link>
        </StackRowAlignCenter>
      </BoxForm>
    </Box>
  );
}
