import React, { useEffect, useState } from 'react';
import TableElement from '~/components/elements/table-element/table-element';
import { TagElement } from '~/components/elements/tag/tag.element';
import {
  TableRow,
  TableCell,
  IconButton,
  Tooltip,
  Typography,
  TextField,
  MenuItem,
  Stack,
} from '@mui/material';
import { ModeEditOutlineOutlined } from '@mui/icons-material';
import { User } from '~/apis/user/user.interfaces.api';
import { userApi } from '~/apis';
import { ConvertRole, NameStatusRole, StatusRole } from './customers.state';
import { ModalElement } from '~/components/modal/modal-element/modal-element';
import { useSnackbar } from '~/hooks/use-snackbar/use-snackbar';
import { useFormik } from 'formik';

const actionName: Record<number, string> = {
  0: "Bị khóa",
  1: "Hoạt động",
}
const actionColor: Record<number, string> = {
  0: "error",
  1: "success",
}


const CustomersList: React.FC = () => {
  const { snackbar } = useSnackbar();
  const [listPersonnel, setListPersonnel] = useState<User[]>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleUpdate = async (values?: any) => {
    if (!selectedUser || typeof selectedUser.id !== 'number') return;
    try {
      const payload = {
        name: values?.name ?? selectedUser.name,
        role_id: Number(values?.role_id ?? selectedUser.role_id ?? ''),
        status: Number(values?.status ?? selectedUser.status),
      };
      await userApi.updatePersonnel(selectedUser.id, payload);
      snackbar('success', 'Cập nhật nhân viên thành công');
      setOpenModal(false);
      setSelectedUser(null);
      fetchPersonnel();
    } catch (err) {
      console.error('Lỗi cập nhật nhân viên:', err);
      snackbar('error', 'Cập nhật thất bại');
    }
  }

  const fetchPersonnel = async () => {
    const res = await userApi.getPersonnelList();
    setListPersonnel(res);
  };
  useEffect(() => {
    fetchPersonnel();
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: selectedUser?.name ?? '',
      role_id: selectedUser?.role?.name ? ConvertRole[selectedUser.role?.name] : '',
      status: selectedUser ? String(selectedUser.status) : '1',
    },
    onSubmit: async (values) => {
      await handleUpdate(values);
    },
  });
  
  const columns = [
    { id: 'id', label: 'STT' },
    { id: 'fullName', label: 'Họ tên nhân viên', width: 240 },
    { id: 'email', label: 'Email', width: 260 },
    { id: 'role', label: 'Vai trò' },
    { id: 'status', label: 'Trạng thái' },
    { id: 'action', label: 'Action', width: 160 },
  ];

  return (
    <React.Fragment>
      <TableElement
        columns={columns}
        rows={listPersonnel}
        renderRow={(user, index) => (
          <TableRow hover key={user.id}>
            <TableCell>
              <Typography sx={{ textAlign: 'center' }}>{index + 1}</Typography>
            </TableCell>
            <TableCell>
              <Typography>{user.name}</Typography>
            </TableCell>
            <TableCell>
              <Typography>{user.email}</Typography>
            </TableCell>
            <TableCell>
              <TagElement type={StatusRole[user.role?.name || '']} content={NameStatusRole[user.role?.name || '']} />
            </TableCell>
            <TableCell>
              <TagElement
                type={actionColor[user.status || 1] as any}
                content={actionName[user.status || 1]}
              />
            </TableCell>
            <TableCell sx={{ position: 'sticky', right: 0, backgroundColor: 'background.default' }}>
              <Typography sx={{ width: '100%', cursor: 'pointer', display: 'flex', justifyContent: 'center' }}>
                <Tooltip title="Sửa">
                  <span
                    style={{ display: 'inline-block' }}
                    onClick={() => {
                      if (user.role?.name === 'admin') return;
                      setSelectedUser(user);
                      setOpenModal(true);
                    }}
                  >
                    <IconButton size="small" disabled={user.role?.name === 'admin'}>
                      <ModeEditOutlineOutlined fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              </Typography>
            </TableCell>
          </TableRow>
        )}
      />
      {/* modal cho user khi click vào phòng pending */}
      <ModalElement
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setSelectedUser(null);
        }}
        title="Cập nhật thông tin nhân viên"
        message={
          <Stack spacing={2} sx={{ width: '100%', pt: 1 }}>
            <TextField
              label="Tên"
              fullWidth
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
            />
            <TextField
              select
              label="Vai trò"
              name="role_id"
              value={formik.values.role_id ?? ''}
              onChange={(e) => formik.setFieldValue('role_id', e.target.value)}
              fullWidth
            >
              <MenuItem value="2">Ban lãnh đạo</MenuItem>
              <MenuItem value="3">Quản lý</MenuItem>
              <MenuItem value="5">Marketing</MenuItem>
              <MenuItem value="6">Staff</MenuItem>
              <MenuItem value="7">Nhân viên kho</MenuItem>
            </TextField>
            <TextField
              select
              label="Trạng thái"
              name="status"
              value={formik.values.status ?? '1'}
              onChange={(e) => formik.setFieldValue('status', e.target.value)}
              fullWidth
            >
              <MenuItem value="1">Hoạt động</MenuItem>
              <MenuItem value="0">Khóa</MenuItem>
            </TextField>
          </Stack>
        }
        maxWidth="sm"
        confirmText="Đồng ý"
        onConfirm={() => {
          formik.submitForm();
        }}
        cancelText="Đóng"
      />
    </React.Fragment>
  );
};

export default CustomersList;
