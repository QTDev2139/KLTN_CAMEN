import { useFormik } from 'formik';
import {
  Box,
  Button,
  TextField,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import { getIn } from 'formik';
import { useRef, useState } from 'react';

import { StackRow } from '~/components/elements/styles/stack.style';
import { useSnackbar } from '~/hooks/use-snackbar/use-snackbar';
import { FormContact } from './contact-type';
import { ContactSchema } from './contact-schema';
import { contactApi } from '~/apis';
import ReCAPTCHA from 'react-google-recaptcha';

export default function ContactForm() {
  const { snackbar } = useSnackbar();

  const { palette } = useTheme();

  const recaptchaRef = useRef<ReCAPTCHA | null>(null);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const formik = useFormik<FormContact>({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      title: '',
      content: '',
    },
    validationSchema: ContactSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setSubmitting(true);

        // Bắt buộc token
        if (!recaptchaToken) {
          snackbar('error', 'Vui lòng xác nhận không phải robot');
          setSubmitting(false);
          return;
        }
        const data = { ...values, recaptcha_token: recaptchaToken };
        // Gửi values + recaptcha token về server để verify với secret
        console.log('Contact form data:', data);
        const res = await contactApi.createContact(data);
        snackbar('success', res?.data?.message || 'Gửi liên hệ thành côngg');
        formik.resetForm();
        recaptchaRef.current?.reset();
        setRecaptchaToken(null);
      } catch (error: any) {
        const message = error?.message || 'Lỗi không xác định';
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
    <Box
      component="form"
      onSubmit={formik.handleSubmit}
      noValidate
      sx={{ width: '100%', backgroundColor: palette.background.default, padding: '20px' }}
    >
      <StackRow sx={{ gap: 2 }}>
        <TextField
          label="Tên của bạn"
          variant="standard"
          fullWidth
          {...formik.getFieldProps('name')}
          error={showError('name')}
          helperText={helperText('name')}
        />
        <TextField
          label="Địa chỉ Email"
          variant="standard"
          fullWidth
          {...formik.getFieldProps('email')}
          error={showError('email')}
          helperText={helperText('email')}
        />
      </StackRow>
      <StackRow sx={{ gap: 2 }}>
        <TextField
          label="Số điện thoại"
          variant="standard"
          fullWidth
          {...formik.getFieldProps('phone')}
          error={showError('phone')}
          helperText={helperText('phone')}
        />
        {/* <TextField
          label="Tiêu đề"
          variant="standard"
          fullWidth
          {...formik.getFieldProps('title')}
          error={showError('title')}
          helperText={helperText('title')}
        /> */}
        <FormControl variant="standard" fullWidth error={showError('title')}>
          <InputLabel id="contact-title-label">Loại dịch vụ</InputLabel>
          <Select labelId="contact-title-label" label="Loại dịch vụ" {...formik.getFieldProps('title')}>
            <MenuItem value="">
              <em>Chọn</em>
            </MenuItem>
            <MenuItem value="export">Xuất khẩu</MenuItem>
            <MenuItem value="agency">Đại lý</MenuItem>
            <MenuItem value="media">Truyền thông</MenuItem>
          </Select>
          <FormHelperText>{helperText('title')}</FormHelperText>
        </FormControl>
      </StackRow>
      <TextField
        label="Nội dung"
        variant="standard"
        fullWidth
        multiline
        minRows={4}
        {...formik.getFieldProps('content')}
        error={showError('content')}
        helperText={helperText('content')}
      />

      {/* reCAPTCHA widget */}
      <Box sx={{ my: 2 }}>
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey="6Les7xcsAAAAAGjvO7hCiENL9QurrfNiP2odhZUx"
          onChange={(token: string | null) => setRecaptchaToken(token)}
        />
      </Box>

      <Button type="submit" variant="contained" size="large" disabled={formik.isSubmitting} fullWidth>
        {formik.isSubmitting ? 'Đang gửi…' : 'Gửi liên hệ'}
      </Button>
    </Box>
  );
}
