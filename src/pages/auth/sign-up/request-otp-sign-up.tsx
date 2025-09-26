import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Box, Button, TextField, Typography } from '@mui/material';
import { getIn } from 'formik';
import { userApi } from '~/apis';
import Logo from '~/components/logo/logo';
import { FONT_SIZE } from '~/common/constant/style.constant';

import { SignUpMode } from './sign-up.enum';
import { StackRowAlignCenter } from '~/components/elements/styles/stack.style';
import { Link, useParams } from 'react-router-dom';
import { AUTH_SCREEN } from '~/router/path.route';
import { useSnackbar } from '~/hooks/use-snackbar/use-snackbar';

interface Props {
  setMode: (mode: SignUpMode) => void;
  setEmail: (email: string) => void;
}

export interface FormRegister {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
}

const schema = Yup.object({
  name: Yup.string().required('Vui lòng nhập tên'),
  email: Yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
  password: Yup.string().min(6, 'Mật khẩu phải ít nhất 6 ký tự').required('Vui lòng mật khẩu'),
  confirm_password: Yup.string()
    .oneOf([Yup.ref('password')], 'Mật khẩu không khớp')
    .required('Vui lòng mật khẩu'),
});

export default function RequestOtpSignUp({ setMode, setEmail }: Props) {

  const { lang } = useParams();
  const { snackbar } = useSnackbar();

  const formik = useFormik<FormRegister>({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirm_password: '',
    },
    validationSchema: schema,
    onSubmit: async (values, { setSubmitting }) => {
      // setSubmitting: formik.isSubmitting sẽ được đặt thành true
      try {
        setSubmitting(true);
        const { confirm_password, ...dataToSend } = values;
        const res = await userApi.createRegister(dataToSend);

        console.log(res);
        snackbar('success', res);
        setEmail(dataToSend.email);
        setMode(SignUpMode.VERIFY);
      } catch (error: any) {
        const message = error?.response?.data?.message || 'Lỗi không xác định';
        snackbar('error', message)
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
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        noValidate
        sx={{ maxWidth: 360, placeItems: 'center', mt: 4 }}
      >
        <Logo />
        <Typography variant="h5" sx={{ textAlign: 'center', fontSize: FONT_SIZE.large, padding: '20px 0 32px 0' }}>
          Sign up to CamenFood
        </Typography>
        <TextField
          label="User Name"
          fullWidth
          {...formik.getFieldProps('name')}
          error={showError('name')}
          helperText={helperText('name')}
        />
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
        <TextField
          label="Confirm Password"
          type="password"
          fullWidth
          {...formik.getFieldProps('confirm_password')}
          error={showError('confirm_password')}
          helperText={helperText('confirm_password')}
        />
        <Button type="submit" variant="contained" size="large" disabled={formik.isSubmitting} fullWidth>
          {formik.isSubmitting ? 'Đang gửi…' : 'Create account'}
        </Button>
        
        <StackRowAlignCenter sx={{ justifyContent: 'center', width: '100%', padding: '20px 0' }}>
          <Typography sx={{ paddingRight: '6px' }}>You have an account?</Typography>
          <Link to={`/${lang}/auth/${AUTH_SCREEN.LOGIN}`} replace>
            Login with an account
          </Link>
        </StackRowAlignCenter>
      </Box>
    </Box>
  );
}
