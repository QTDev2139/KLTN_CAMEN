import React, { useMemo, useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Stack,
  Divider,
  Button,
  TextField,
  MenuItem,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { useFormik, getIn } from 'formik';
import { schema } from './coupon.schema';
import { useSnackbar } from '~/hooks/use-snackbar/use-snackbar';
import { Coupon } from '~/apis/coupon/coupon.api.interface';

type CouponFormValues = Partial<Coupon>;

export default function CouponUpdate(props: {
  initial?: Partial<Coupon>;
  onSuccess?: () => void;
}) {
  const { initial, onSuccess } = props;
  const { snackbar } = useSnackbar();

  const isEditMode = !!(initial && 'id' in initial && initial?.id);

  // ----- Formik -----
  const formik = useFormik<CouponFormValues>({
    validationSchema: schema,
    enableReinitialize: true,
    initialValues: {
      id: initial?.id,
      code: initial?.code ?? '',
      discount_type: initial?.discount_type ?? 'fixed',
      discount_value: initial?.discount_value ?? '',
      min_order_amount: initial?.min_order_amount ?? '',
      usage_limit: initial?.usage_limit ?? 0,
      used_count: initial?.used_count ?? 0,
      start_date: initial?.start_date ?? '',
      end_date: initial?.end_date ?? '',
      state: initial?.state ?? 'pending',
      is_active: initial?.is_active ?? true,
      user: initial?.user ?? { name: '' },
    },
    onSubmit: async (values, helpers) => {
      try {
        // TODO: Call your coupon API here (create/update)
        // Example:
        // if (isEditMode && values.id) {
        //   const res = await couponApi.update(values.id, values);
        //   snackbar('success', res.message || 'Cập nhật mã giảm giá thành công');
        // } else {
        //   const res = await couponApi.create(values);
        //   snackbar('success', res.message || 'Tạo mã giảm giá thành công');
        // }

        console.log('Submitting coupon values:', values);
        snackbar('success', isEditMode ? 'Cập nhật mã giảm giá thành công' : 'Tạo mã giảm giá thành công');
        onSuccess?.();
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
          {isEditMode ? 'Chỉnh sửa mã giảm giá' : 'Tạo mã giảm giá'}
        </Typography>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mt: 2 }}>
          <TextField
            label="Mã code"
            fullWidth
            {...formik.getFieldProps('code')}
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
            <MenuItem value="fixed">Fixed</MenuItem>
            <MenuItem value="percentage">Percentage</MenuItem>
          </TextField>
        </Stack>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mt: 2 }}>
          <TextField
            label="Giá trị giảm"
            type="number"
            fullWidth
            {...formik.getFieldProps('discount_value')}
            error={showError('discount_value')}
            helperText={helperText('discount_value')}
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
            select
            fullWidth
            {...formik.getFieldProps('state')}
            error={showError('state')}
            helperText={helperText('state')}
          >
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
            <MenuItem value="expired">Expired</MenuItem>
            <MenuItem value="disabled">Disabled</MenuItem>
          </TextField>

          <FormControlLabel
            sx={{ ml: 1 }}
            control={
              <Switch
                checked={!!formik.values.is_active}
                onChange={(_, checked) => formik.setFieldValue('is_active', checked)}
                onBlur={() => formik.setFieldTouched('is_active', true)}
              />
            }
            label="Kích hoạt"
          />
        </Stack>

        <Divider sx={{ my: 2 }} />

        <TextField
          label="Người tạo"
          fullWidth
          value={formik.values.user?.name || ''}
          InputProps={{ readOnly: true }}
          helperText="Chỉ đọc"
        />
      </Paper>

      <Stack direction="row" justifyContent="flex-end" mt={3} spacing={2}>
        <Button type="button" variant="outlined" onClick={() => formik.resetForm()} disabled={formik.isSubmitting}>
          Reset
        </Button>
        <Button type="submit" variant="contained" size="large" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? (isEditMode ? 'Đang cập nhật...' : 'Đang lưu...') : isEditMode ? 'Cập nhật' : 'Lưu'}
        </Button>
      </Stack>
    </Box>
  );
}
