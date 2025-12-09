import React, { useEffect, useState, useMemo } from 'react';
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
  Box,
  Pagination,
} from '@mui/material';
import { ModeEditOutlineOutlined, Search as SearchIcon } from '@mui/icons-material';
import { User } from '~/apis/user/user.interfaces.api';
import { userApi } from '~/apis';
import { ConvertRole } from './customers.state';
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
  const [listCustomers, setListCustomers] = useState<User[]>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchEmail, setSearchEmail] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const CUSTOMERS_PER_PAGE = 8;

  const handleUpdate = async (values?: any) => {
    if (!selectedUser || typeof selectedUser.id !== 'number') return;
    try {
      const payload = {
        name: values?.name ?? selectedUser.name,
        status: Number(values?.status ?? selectedUser.status),
        role_id: 4,
      };
      await userApi.updatePersonnel(selectedUser.id, payload);
      snackbar('success', 'Cập nhật khách hàng thành công');
      setOpenModal(false);
      setSelectedUser(null);
      setCurrentPage(1); // Reset to first page after update
      fetchCustomers();
    } catch (err) {
      console.error('Lỗi cập nhật khách hàng:', err);
      snackbar('error', 'Cập nhật thất bại');
    }
  }

  const fetchCustomers = async () => {
    try {
      const res = await userApi.getPersonnel(4);
      setListCustomers(res);
      setCurrentPage(1); // Reset to first page when fetching new data
    } catch (error) {
      console.error('Lỗi tải danh sách khách hàng:', error);
      snackbar('error', 'Không tải được danh sách khách hàng');
    }
  };

  useEffect(() => {
    fetchCustomers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter customers by email
  const filteredCustomers = useMemo(() => {
    return listCustomers.filter((customer) =>
      customer.email.toLowerCase().includes(searchEmail.toLowerCase())
    );
  }, [listCustomers, searchEmail]);

  // Paginate filtered customers
  const paginatedCustomers = useMemo(() => {
    return filteredCustomers.slice((currentPage - 1) * CUSTOMERS_PER_PAGE, currentPage * CUSTOMERS_PER_PAGE);
  }, [filteredCustomers, currentPage]);

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when search email changes
  }, [searchEmail]);

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
    { id: 'fullName', label: 'Họ tên khách hàng', width: 240 },
    { id: 'email', label: 'Email', width: 260 },
    { id: 'status', label: 'Trạng thái' },
    { id: 'action', label: 'Action', width: 160 },
  ];

  return (
    <React.Fragment>
      <Box
        sx={{
          scrollbarGutter: 'stable',
          '&:has(table)': { overflowY: 'auto' },
        }}
      >
        <TableElement
          columns={columns}
          rows={paginatedCustomers}
          renderRow={(user, index) => (
            <TableRow hover key={user.id}>
              <TableCell>
                <Typography sx={{ textAlign: 'center' }}>{(currentPage - 1) * CUSTOMERS_PER_PAGE + index + 1}</Typography>
              </TableCell>
              <TableCell>
                <Typography>{user.name}</Typography>
              </TableCell>
              <TableCell>
                <Typography>{user.email}</Typography>
              </TableCell>
              <TableCell>
                <TagElement
                  type={actionColor[user.status || 0] as any}
                  content={actionName[user.status || 0]}
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
      </Box>

      {Math.ceil(filteredCustomers.length / CUSTOMERS_PER_PAGE) > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={Math.ceil(filteredCustomers.length / CUSTOMERS_PER_PAGE)}
            page={currentPage}
            variant="outlined"
            onChange={(event, value) => setCurrentPage(value)}
          />
        </Box>
      )}

      {/* modal cho user khi click vào phòng pending */}
      <ModalElement
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setSelectedUser(null);
        }}
        title="Cập nhật thông tin khách hàng"
        message={
          <Stack spacing={2} sx={{ width: '100%', pt: 1 }}>
            <TextField
              label="Tên"
              fullWidth
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              disabled
            />
            
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
