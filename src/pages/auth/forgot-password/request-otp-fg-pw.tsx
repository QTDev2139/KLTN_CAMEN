import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Box, Button, Divider, TextField, Typography } from '@mui/material';
import { getIn } from 'formik';
import { userApi } from '~/apis';
import Logo from '~/components/logo/logo';
import { FONT_SIZE } from '~/common/constant/style.constant';

import { ForgotPasswordMode } from './forgot-password.enum';
import { useParams } from 'react-router-dom';
import { useSnackbar } from '~/hooks/use-snackbar/use-snackbar';

interface Props {
  setMode: (mode: ForgotPasswordMode) => void;
  setEmail: (email: string) => void;
}

export interface FormRegister {
  email: string;
}

const schema = Yup.object({
  email: Yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
});

export default function RequestOtpForgottenPassword({ setMode, setEmail }: Props) {

  const { snackbar } = useSnackbar();

  const formik = useFormik<FormRegister>({
    initialValues: {
      email: '',
    },
    validationSchema: schema,
    onSubmit: async (values, { setSubmitting }) => {
      // setSubmitting: formik.isSubmitting sẽ được đặt thành true
      try {
        setSubmitting(true);
        const res = await userApi.requestOtpForForgottenPassword(values);

        snackbar('success', res);
        setEmail(values.email);
        setMode(ForgotPasswordMode.VERIFY);
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
        sx={{ padding: '24px',
          border: '1px solid #ccc',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          position: 'relative', }}
      >
        <Logo />
        <Typography variant="h5" sx={{ textAlign: 'center', fontSize: FONT_SIZE.large, padding: '10px' }}>
          Forgot Password to CamenFood
        </Typography>
        <TextField
          label="Email"
          fullWidth
          {...formik.getFieldProps('email')}
          error={showError('email')}
          helperText={helperText('email')}
        />
        <Button type="submit" variant="contained" size="large" disabled={formik.isSubmitting} fullWidth>
          {formik.isSubmitting ? 'Đang gửi…' : 'Xác nhận'}
        </Button>
        
        
      </Box>
    </Box>
  );
}
