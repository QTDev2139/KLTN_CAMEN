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
import { authApi } from '~/apis/auth/auth.api';
import { useLang } from '~/hooks/use-lang/use-lang';
import { getLangPrefix } from '~/common/constant/get-lang-prefix';
import { useTranslation } from 'react-i18next';

export interface FormChangePassword {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const schema = Yup.object({
  oldPassword: Yup.string().required('Vui lòng nhập mật khẩu cũ'),
  newPassword: Yup.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự').required('Vui lòng nhập mật khẩu mới'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Mật khẩu xác nhận không khớp')
    .required('Vui lòng xác nhận mật khẩu mới'),
});

const ChangePasswordPage: React.FC = () => {
  const { snackbar } = useSnackbar();
  const navigate = useNavigate();

  const { t } = useTranslation('login');

  // Lấy lang từ hook
  const currentLang = useLang();
  const prefix = getLangPrefix(currentLang);

  const formik = useFormik<FormChangePassword>({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: schema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setSubmitting(true);
        await authApi.changePassword({ oldPassword: values.oldPassword, newPassword: values.newPassword });
        snackbar('success', 'Đổi mật khẩu thành công');
        // Sau khi đổi mật khẩu thành công, điều hướng về trang đăng nhập
        // navigate(`/${prefix}/auth/${AUTH_SCREEN.SIGN_IN}`, { replace: true });
      } catch (error: any) {
        const resp = error?.response?.data;
        let message = error?.message || 'Có lỗi xảy ra';

        if (resp) {
          if (typeof resp === 'string') {
            message = resp;
          } else if (typeof resp.message === 'string') {
            message = resp.message;
          } else if (resp.errors) {
            if (Array.isArray(resp.errors)) {
              message = resp.errors.join(', ');
            } else if (typeof resp.errors === 'object') {
              message = Object.values(resp.errors).flat().join(', ');
            }
          }
        }

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
        <Typography variant="h5" sx={{ textAlign: 'center', fontSize: FONT_SIZE.large, padding: '10px 0' }}>
          {'Đổi mật khẩu'}
        </Typography>

        <TextField
          label={ 'Mật khẩu cũ'}
          type="password"
          fullWidth
          {...formik.getFieldProps('oldPassword')}
          error={showError('oldPassword')}
          helperText={helperText('oldPassword')}
        />

        <TextField
          label={ 'Mật khẩu mới'}
          type="password"
          fullWidth
          {...formik.getFieldProps('newPassword')}
          error={showError('newPassword')}
          helperText={helperText('newPassword')}
        />

        <TextField
          label={ 'Xác nhận mật khẩu mới'}
          type="password"
          fullWidth
          {...formik.getFieldProps('confirmPassword')}
          error={showError('confirmPassword')}
          helperText={helperText('confirmPassword')}
        />

        <Button type="submit" variant="contained" size="large" disabled={formik.isSubmitting} fullWidth>
          {formik.isSubmitting ? 'Đang xử lý...' : 'Đổi mật khẩu'}
        </Button>

      </BoxForm>
    </Box>
  );
}

export default ChangePasswordPage;
