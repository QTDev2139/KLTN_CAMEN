import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CustomersList from './customers.list';
import { Divider, Stack, useTheme, TextField, MenuItem } from '@mui/material';
import { ModalElement } from '~/components/modal/modal-element/modal-element';
import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSnackbar } from '~/hooks/use-snackbar/use-snackbar';
import { userApi } from '~/apis';

export default function CustomersScreen() {
  const { palette } = useTheme();
  const { snackbar } = useSnackbar();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Tên là bắt buộc').min(2, 'Tên phải có ít nhất 2 ký tự'),
    email: Yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
    role_id: Yup.string().required('Vai trò là bắt buộc'),
  });

  const formik = useFormik({
    initialValues: { name: '', email: '', role_id: '' },
    validationSchema,
    onSubmit: async (values, helpers) => {
      try {
        await userApi.createPersonnel({ ...values, role_id: Number(values.role_id) })
        setOpenModal(false);
        snackbar('success', 'Thêm nhân viên mới thành công');
        helpers.resetForm();
        setRefreshKey((k) => k + 1);
      } catch (err) {
        console.error('Lỗi khi thêm nhân viên mới:', err);
        snackbar('error', 'Email đã tồn tại');
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  return (
    <Stack spacing={2}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h3">Quản lý nhân viên</Typography>
        <Button
          onClick={() => {
            formik.resetForm();
            setOpenModal(true);
          }}
        >
          <Typography variant="subtitle2">Thêm nhân viên mới</Typography>
        </Button>
      </Box>
      <Divider sx={{ color: palette.divider }} />

      <CustomersList key={refreshKey} />

      <ModalElement
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          formik.resetForm();
        }}
        title="Thêm nhân viên mới"
        message={
          <Stack spacing={2} sx={{ width: '100%', pt: 1 }}>
            <TextField
              label="Tên"
              fullWidth
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name ? formik.errors.name : ' '}
            />
            <TextField
              label="Email"
              fullWidth
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email ? formik.errors.email : ' '}
            />
            <TextField
              select
              label="Vai trò"
              name="role_id"
              value={formik.values.role_id}
              onChange={(e) => {
                formik.handleChange(e);
                formik.setFieldTouched('role_id', true, false);
              }}
              onBlur={formik.handleBlur}
              fullWidth
              required
              error={formik.touched.role_id && Boolean(formik.errors.role_id)}
              helperText={formik.touched.role_id && formik.errors.role_id ? formik.errors.role_id : ' '}
            >
              <MenuItem value="2">Ban lãnh đạo</MenuItem>
              <MenuItem value="3">Quản lý</MenuItem>
              {/* <MenuItem value="5">Marketing</MenuItem> */}
              <MenuItem value="6">Nhân viên bán hàng</MenuItem>
              <MenuItem value="7">Nhân viên kho</MenuItem>
            </TextField>
          </Stack>
        }
        maxWidth="sm"
        confirmText="Đồng ý"
        onConfirm={() => formik.submitForm()}
        cancelText="Đóng"
      />
    </Stack>
  );
}
