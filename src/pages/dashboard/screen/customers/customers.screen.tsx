import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useCustomersState } from './customers.state';
import CustomersList from './customers.list';
import CustomersForm from './customers.form';
import { User } from './customers.state';
import { useSnackbar } from '~/hooks/use-snackbar/use-snackbar';
import { Divider, Stack, useTheme } from '@mui/material';

export default function CustomersScreen() {
  const { users, modalMode, selected, openAdd, openView, openEdit, closeModal, addUser, updateUser, deleteUser } =
    useCustomersState();

  const { snackbar } = useSnackbar();
  const { palette } = useTheme();

  async function handleSave(payload: { fullName: string; email: string; password?: string; role: any; status: any }) {
    try {
      if (modalMode === 'add') {
        // In real app you'd call API & hash password -- here we just add
        addUser({ fullName: payload.fullName, email: payload.email, role: payload.role, status: payload.status });
        snackbar('success', 'Thêm nhân viên thành công');
        closeModal();
        return;
      }
      if (modalMode === 'edit' && selected) {
        updateUser(selected.id, {
          fullName: payload.fullName,
          email: payload.email,
          role: payload.role,
          status: payload.status,
        });
        snackbar('success', 'Cập nhật nhân viên thành công');
        closeModal();
        return;
      }
    } catch (err: any) {
      snackbar('error', err?.message || 'Có lỗi xảy ra');
    }
  }

  function handleDelete(user: User) {
    const ok = window.confirm(`Xóa nhân viên "${user.fullName}"? Hành động không thể hoàn tác.`);
    if (!ok) return;
    deleteUser(user.id);
    snackbar('success', 'Xóa nhân viên thành công');
  }

  return (
    <Stack spacing={2}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h3">Quản lý nhân viên</Typography>
        <Button onClick={openAdd}>
          <Typography variant="subtitle2">Thêm nhân viên mới</Typography>
        </Button>
      </Box>
      <Divider sx={{ color: palette.divider }} />

      <CustomersList users={users} onView={openView} onEdit={openEdit} onDelete={handleDelete} />

      <CustomersForm
        open={!!modalMode}
        mode={modalMode}
        initial={selected ?? null}
        onClose={closeModal}
        onSave={handleSave}
      />
    </Stack>
  );
}
