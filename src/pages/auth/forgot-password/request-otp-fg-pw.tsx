import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Box, Button, TextField, Typography } from '@mui/material';
import { getIn } from 'formik';
import { userApi } from '~/apis';
import Logo from '~/components/logo/logo';
import { FONT_SIZE } from '~/common/constant/style.constant';

import { ForgotPasswordMode } from './forgot-password.enum';
import { useSnackbar } from '~/hooks/use-snackbar/use-snackbar';
import { BoxForm } from '~/components/elements/forms/box/box-form';
import { ArrowCircleLeftOutlined } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { AUTH_SCREEN } from '~/router/path.route';
import { useLang } from '~/hooks/use-lang/use-lang';
import { getLangPrefix } from '~/common/constant/get-lang-prefix';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation('forgot-password');
  const { snackbar } = useSnackbar();
  const currentLang = useLang();
  const prefix = getLangPrefix(currentLang);

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
        <Link
          to={`${prefix}/auth/${AUTH_SCREEN.LOGIN}`}
          style={{ position: 'absolute', top: '10px', left: '10px', color: 'text.primary' }}
        >
          <ArrowCircleLeftOutlined sx={{ color: 'text.secondary' }} />
        </Link>
        <Logo />
        <Typography variant="h5" sx={{ textAlign: 'center', fontSize: FONT_SIZE.large, padding: '10px' }}>
          {t('title')}
        </Typography>
        <TextField
          label={t('email_placeholder')}
          fullWidth
          {...formik.getFieldProps('email')}
          error={showError('email')}
          helperText={helperText('email')}
        />
        <Button type="submit" variant="contained" size="large" disabled={formik.isSubmitting} fullWidth>
          {formik.isSubmitting ? t('confirm_button') : t('confirm_button')}
        </Button>
      </BoxForm>
    </Box>
  );
}
