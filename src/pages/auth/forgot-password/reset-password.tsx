import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Box, Button, TextField, Typography } from '@mui/material';
import { getIn } from 'formik';
import { userApi } from '~/apis';
import Logo from '~/components/logo/logo';
import { FONT_SIZE } from '~/common/constant/style.constant';

import { useNavigate, useParams } from 'react-router-dom';
import { AUTH_SCREEN } from '~/router/path.route';
import { useSnackbar } from '~/hooks/use-snackbar/use-snackbar';
import { BoxForm } from '~/components/elements/forms/box/box-form';

export interface FormResetPw {
  password: string;
  confirm_password: string;
}

const schema = Yup.object({
  password: Yup.string().min(6, 'Mật khẩu phải ít nhất 6 ký tự').required('Vui lòng mật khẩu'),
  confirm_password: Yup.string()
    .oneOf([Yup.ref('password')], 'Mật khẩu không khớp')
    .required('Vui lòng mật khẩu'),
});

export default function ResetPassword() {
  const { lang } = useParams();
  const { snackbar } = useSnackbar();
  const navigate = useNavigate();

  const formik = useFormik<FormResetPw>({
    initialValues: {
      password: '',
      confirm_password: '',
    },
    validationSchema: schema,
    onSubmit: async (values, { setSubmitting }) => {
      // setSubmitting: formik.isSubmitting sẽ được đặt thành true
      try {
        setSubmitting(true);
        const { confirm_password, ...dataToSend } = values;
        const reset_token = localStorage.getItem('resetToken') || '';

        const data = { ...dataToSend, reset_token };
        const res = await userApi.resetPassword(data);
        snackbar('success', res);
        navigate(`/${lang}/auth/${AUTH_SCREEN.LOGIN}`);
      } catch (error: any) {
        const message = error?.response?.data?.message || 'Lỗi không xác định';
        snackbar('error', message);
      } finally {
        localStorage.removeItem('resetToken');
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
        <Typography variant="h5" sx={{ textAlign: 'center', fontSize: FONT_SIZE.large, padding: '20px 0 32px 0' }}>
          Update Password to CamenFood
        </Typography>
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
          {formik.isSubmitting ? 'Đang gửi…' : 'Update password'}
        </Button>
      </BoxForm>
    </Box>
  );
}
