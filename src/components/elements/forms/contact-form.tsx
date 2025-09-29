import { useFormik } from 'formik';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { getIn } from 'formik';

import { StackRow, StackRowAlignCenter } from '~/components/elements/styles/stack.style';
import { useSnackbar } from '~/hooks/use-snackbar/use-snackbar';
import { FormContact } from './contact-type';
import { ContactSchema } from './contact-schema';

export default function ContactForm() {
  const { snackbar } = useSnackbar();

  const { palette } = useTheme();
  const formik = useFormik<FormContact>({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      title: '',
      content: '',
      gender: '',
    },
    validationSchema: ContactSchema,
    onSubmit: async (values, { setSubmitting }) => {
      // setSubmitting: formik.isSubmitting sẽ được đặt thành true
      try {
        setSubmitting(true);
        // const { confirm_password, ...dataToSend } = values;
        // const res = await userApi.createRegister(dataToSend);

        console.log(values);
        // snackbar('success', res);
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
        <TextField
          label="Tiêu đề"
          variant="standard"
          fullWidth
          {...formik.getFieldProps('title')}
          error={showError('title')}
          helperText={helperText('title')}
        />
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
      <FormControl>
        <FormLabel id="demo-row-radio-buttons-group-label">Vai trò</FormLabel>
        <RadioGroup
          row
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="row-radio-buttons-group"
          value={formik.values.gender} // 👈 lấy value từ Formik
          onChange={formik.handleChange}
        >
          <FormControlLabel value="Đại lý" control={<Radio />} label="Đại lý" />
          <FormControlLabel value="Thành viên" control={<Radio />} label="Thành viên" />
        </RadioGroup>
      </FormControl>

      <Button type="submit" variant="contained" size="large" disabled={formik.isSubmitting} fullWidth>
        {formik.isSubmitting ? 'Đang gửi…' : 'Gửi liên hệ'}
      </Button>
    </Box>
  );
}
