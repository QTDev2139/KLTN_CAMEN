import { Box, Paper, Typography, Stack, Divider, Button, TextField, MenuItem } from '@mui/material';
import { useFormik, getIn } from 'formik';
import { schema } from './coupon.schema';
import { useSnackbar } from '~/hooks/use-snackbar/use-snackbar';
import { CreateCoupon } from '~/apis/coupon/coupon.interface.api';
import { getDefaultDates } from '~/common/until/date-format.until';
import { couponApi } from '~/apis';

type CouponFormValues = Partial<CreateCoupon>;

type CouponCreateProps = {
  onSubmit?: () => void;
};

export default function CouponCreate({ onSubmit }: CouponCreateProps) {
  const { snackbar } = useSnackbar();

  const { startDate, endDate } = getDefaultDates();
  // ----- Formik (create only) -----
  const formik = useFormik<CouponFormValues>({
    validationSchema: schema,
    enableReinitialize: true,
    initialValues: {
      code: '',
      discount_type: 'fixed',
      max_discount_amount: '',
      discount_value: '',
      min_order_amount: '',
      usage_limit: 10,
      used_count: 0,
      start_date: startDate,
      end_date: endDate,
      state: 'pending',
      is_active: true,
      note: '',
    },
    onSubmit: async (values, helpers) => {
      try {
        console.log('Submitting coupon:', values);
        await couponApi.createCoupon(values as CreateCoupon);
        snackbar('success', 'Tạo mã giảm giá thành công');
        if (onSubmit) onSubmit();
      } catch (error: any) {
        snackbar('error', error?.message || 'Có lỗi xảy ra');
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  // ======= Field helpers =======
  const showError = (path: string) => {
    const touched = getIn(formik.touched, path);
    const error = getIn(formik.errors, path);
    return (touched || formik.submitCount > 0) && Boolean(error);
  };
  const helperText = (path: string) => (showError(path) ? (getIn(formik.errors, path) as string) : ' ');

  return (
    <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}>
      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Tạo mã giảm giá
        </Typography>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mt: 2 }}>
          <TextField

            label="Mã code"
            fullWidth
            {...formik.getFieldProps('code')}
            onChange={(e) => formik.setFieldValue('code', (e.target.value || '').toUpperCase())}
            error={showError('code')}
            helperText={helperText('code')}
          />
          <TextField
            label="Loại giảm giá"
            select
            fullWidth
            {...formik.getFieldProps('discount_type')}
            error={showError('discount_type')}
            helperText={helperText('discount_type')}
          >
            <MenuItem value="fixed">Cố định</MenuItem>
            <MenuItem value="percentage">Tỷ lệ %</MenuItem>
          </TextField>
        </Stack>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mt: 2 }}>
          <TextField
            label={formik.values.discount_type === 'fixed' ? "Giá trị giảm" : "Tỷ lệ giảm %"}
            type="number"
            fullWidth
            {...formik.getFieldProps('discount_value')}
            error={showError('discount_value')}
            helperText={helperText('discount_value')}
          />
          <TextField
            label="Giảm giá tối đa"
            type="number"
            fullWidth
            {...formik.getFieldProps('max_discount_amount')}
            error={showError('max_discount_amount')}
            helperText={helperText('max_discount_amount')}
            sx={{ display: formik.values.discount_type === 'fixed' ? 'none' : 'block' }}
          />
          <TextField
            label="Đơn hàng tối thiểu"
            type="number"
            fullWidth
            {...formik.getFieldProps('min_order_amount')}
            error={showError('min_order_amount')}
            helperText={helperText('min_order_amount')}
          />
        </Stack>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mt: 2 }}>
          <TextField
            label="Giới hạn sử dụng"
            type="number"
            fullWidth
            {...formik.getFieldProps('usage_limit')}
            error={showError('usage_limit')}
            helperText={helperText('usage_limit')}
          />
          <TextField
            label="Đã sử dụng"
            type="number"
            fullWidth
            {...formik.getFieldProps('used_count')}
            disabled
            helperText="Chỉ đọc"
          />
        </Stack>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mt: 2 }}>
          <TextField
            label="Ngày bắt đầu"
            type="datetime-local"
            fullWidth
            name="start_date"
            value={formik.values.start_date || ''}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={showError('start_date')}
            helperText={helperText('start_date')}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Ngày kết thúc"
            type="datetime-local"
            fullWidth
            name="end_date"
            value={formik.values.end_date || ''}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={showError('end_date')}
            helperText={helperText('end_date')}
            InputLabelProps={{ shrink: true }}
          />
        </Stack>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mt: 2 }}>
          <TextField
            label="Trạng thái"
            type="text"
            fullWidth
            {...formik.getFieldProps('state')}
            error={showError('state')}
            helperText={helperText('state')}
            disabled
          />
            
        </Stack>
          <TextField
            multiline
            rows={3}
            label="note"
            type="text"
            fullWidth
            {...formik.getFieldProps('note')}
            error={showError('note')}
            helperText={helperText('note')}
          />

        <Divider sx={{ my: 2 }} />
      </Paper>

      <Stack direction="row" justifyContent="flex-end" mt={3} spacing={2}>
        <Button type="button" variant="outlined" onClick={() => formik.resetForm()} disabled={formik.isSubmitting}>
          Reset
        </Button>
        <Button type="submit" variant="contained" size="large" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? 'Đang lưu...' : 'Lưu'}
        </Button>
      </Stack>
    </Box>
  );
}
