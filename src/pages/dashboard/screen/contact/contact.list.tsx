import React, { useEffect, useState, useMemo } from 'react';
import TableElement from '~/components/elements/table-element/table-element';
import {
  TableRow,
  TableCell,
  IconButton,
  Stack,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  Pagination,
} from '@mui/material';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import EditOutlined from '@mui/icons-material/EditOutlined';
import { contactApi, userApi } from '~/apis';
import { TagElement } from '~/components/elements/tag/tag.element';
import { formatDateTime } from '~/common/until/date-format.until';
import { getLimitLineCss } from '~/common/until/get-limit-line-css';
import { StateLabelContact } from './contact.status';
import { useSnackbar } from '~/hooks/use-snackbar/use-snackbar';
import { User } from '~/apis/user/user.interfaces.api';
import { ModalConfirm } from '~/components/modal/modal-confirm/modal-confirm';

type ContactItem = {
  id: number | string;
  name: string;
  email: string;
  phone?: string;
  title?: string;
  content?: string;
  created_at?: string;
  status?: number;
  note?: string;
  user_id?: number;
  user?: User;
};

const CONTACTS_PER_PAGE = 6;

interface ContactListProps {
  selectedServices: string[];
}

const ContactList: React.FC<ContactListProps> = ({ selectedServices }) => {
  const [items, setItems] = useState<ContactItem[]>([]);
  const [dsnv, setDsnv] = useState<any[]>([]);
  const { snackbar } = useSnackbar();

  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState<ContactItem | null>(null);
  const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null);
  const [openConfirm, setOpenConfirm] = useState(false);

  const [role, setRole] = useState('');
  const [note, setNote] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchProfile = async () => {
      const profile = await userApi.getProfile();
      setRole(profile.role.name);
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    if (editOpen && selected) {
      setSelectedStaffId(selected.user_id ?? null);
    }
  }, [selected, editOpen]);

  const fetchList = async () => {
    try {
      const data = await contactApi.listContacts();
      setItems(data);
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await userApi.getPersonnel(3);
      setDsnv(res);
    };

    fetchProfile();
  }, []);

  // Filter contacts by service
  const filteredContacts = useMemo(() => {
    if (selectedServices.length === 0) return items;
    return items.filter((contact) => 
      contact.title && selectedServices.includes(contact.title)
    );
  }, [items, selectedServices]);

  // Paginate filtered contacts
  const paginatedItems = useMemo(() => {
    return filteredContacts.slice((currentPage - 1) * CONTACTS_PER_PAGE, currentPage * CONTACTS_PER_PAGE);
  }, [filteredContacts, currentPage]);

  // Reset to first page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedServices]);

  const handleUpdate = (row: ContactItem) => {
    setSelected(row);
    setEditOpen(true);
  };

  const handleSubmitUpdate = async () => {
    if (!selected || !selectedStaffId) return;
    try {
      const res = await contactApi.updateSupportContact(selected.id, selectedStaffId);
      snackbar('success', res.message || 'Cập nhật liên hệ thành công');
      await fetchList();
    } catch (err) {
      console.error(err);
      snackbar('error', 'Cập nhật thất bại');
    }
  };

  const handleSubmitState = async () => {
    if (!selected) return;
    try {
      const res = await contactApi.updateStatusContact(selected.id, note);
      snackbar('success', res.message || 'Cập nhật trạng thái thành công');
      await fetchList();
    } catch (err) {
      console.error(err);
      snackbar('error', 'Cập nhật thất bại');
    }
  };

  const handleDelete = async (id: number | string) => {
    try {
      await contactApi.deleteContact(id);
      snackbar('success', 'Xóa liên hệ thành công');
      await fetchList();
      setOpenConfirm(false);
      setCurrentPage(1);
    } catch (e) {
      console.error(e);
    }
  };

  const columns = [
    { id: 'stt', label: 'STT' },
    { id: 'name', label: 'Tên khách hàng', width: 200 },
    { id: 'email', label: 'Địa chỉ email', width: 260 },
    { id: 'phone', label: 'Số điện thoại', width: 140 },
    { id: 'title', label: 'Dịch vụ', width: 140 },
    { id: 'status', label: 'Trạng thái', width: 120 },
    { id: 'content', label: 'Nội dung', width: 320 },
    { id: 'created_at', label: 'Ngày gửi', width: 180 },
    { id: 'user_id', label: 'Người phụ trách', width: 180 },
    { id: 'action', label: 'Action', width: 140 },
  ];

  return (
    <Stack>
      <Box
        sx={{
          scrollbarGutter: 'stable',
          '&:has(table)': { overflowY: 'auto' },
        }}
      >
        <TableElement
          columns={columns}
          rows={paginatedItems}
          renderRow={(row: ContactItem, index: number) => (
            <TableRow key={row.id} hover>
              <TableCell sx={{ textAlign: 'center' }}>{(currentPage - 1) * CONTACTS_PER_PAGE + index + 1}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.email}</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>{row.phone || '-'}</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>{(row.title && StateLabelContact[row.title]) || '-'}</TableCell>
              <TableCell>
                <TagElement
                  type={row.status === 1 ? 'success' : 'error'}
                  content={row.status === 1 ? 'Đã liên hệ' : 'Chưa liên hệ'}
                />
              </TableCell>
              <TableCell sx={{ maxWidth: 320, overflow: 'hidden' }}>
                <Typography
                  sx={{
                    ...getLimitLineCss(1),
                  }}
                >
                  {row.content}
                </Typography>
              </TableCell>
              <TableCell sx={{ textAlign: 'center' }}>{formatDateTime(row.created_at)}</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>{row.user?.name || '-'}</TableCell>
              <TableCell sx={{ position: 'sticky', right: 0, backgroundColor: 'background.default' }}>
                <Stack direction="row" spacing={1} justifyContent="center">
                  <IconButton size="small" title="sửa" onClick={() => handleUpdate(row)}>
                    <EditOutlined fontSize="small" />
                  </IconButton>
                  {(role === 'admin' || role === 'root') && (
                    <IconButton
                      size="small"
                      title="Xóa"
                      onClick={() => {
                        setSelected(row);
                        setOpenConfirm(true);
                      }}
                    >
                      <DeleteOutline fontSize="small" />
                    </IconButton>
                  )}
                </Stack>
              </TableCell>
            </TableRow>
          )}
        />
      </Box>

      {Math.ceil(filteredContacts.length / CONTACTS_PER_PAGE) > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={Math.ceil(filteredContacts.length / CONTACTS_PER_PAGE)}
            page={currentPage}
            variant="outlined"
            onChange={(event, value) => setCurrentPage(value)}
          />
        </Box>
      )}

      <ModalConfirm
        open={openConfirm}
        title="Xóa liên hệ"
        message={`Bạn có chắc muốn xóa liên hệ của "${selected?.name}" không?`}
        onClose={() => setOpenConfirm(false)}
        onConfirm={() => handleDelete(selected?.id!)}
      />

      {/* View dialog */}
      <Dialog
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setSelectedStaffId(null);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>
            <Typography variant="h6">Chi tiết liên hệ</Typography>
            <TagElement
              type={selected?.status === 1 ? 'success' : 'error'}
              content={selected?.status === 1 ? 'Đã liên hệ' : 'Chưa liên hệ'}
            />
          </Stack>
        </DialogTitle>

        <DialogContent dividers>
          {selected ? (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 2,
                alignItems: 'start',
              }}
            >
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Tên khách hàng
                </Typography>
                <Typography variant="body1">{selected.name}</Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Địa chỉ email
                </Typography>
                <Typography variant="body1">{selected.email}</Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Số điện thoại
                </Typography>
                <Typography variant="body1">{selected.phone || '-'}</Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Dịch vụ
                </Typography>
                <Typography variant="body1">{(selected.title && StateLabelContact[selected.title]) || '-'}</Typography>
              </Box>

              <Box sx={{ gridColumn: '1 / -1' }}>
                <Typography variant="caption" color="text.secondary">
                  Nội dung
                </Typography>
                <Box
                  sx={{
                    mt: 1,
                    p: 2,
                    bgcolor: 'background.default',
                    borderRadius: 1,
                    width: '94%',
                    overflow: 'auto',
                    overflowWrap: 'anywhere',
                    wordBreak: 'break-word',
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      whiteSpace: 'pre-wrap',
                      overflowWrap: 'anywhere',
                      wordBreak: 'break-word',
                    }}
                  >
                    {selected.content}
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Ngày gửi
                </Typography>
                <Typography variant="body2">{formatDateTime(selected.created_at)}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Người hỗ trợ
                </Typography>
                {selected.user?.name ? (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {selected.user?.name}
                  </Typography>
                ) : (
                  <>
                    {dsnv.map((nv) => (
                      <Stack
                        key={nv.id}
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ py: 1 }}
                      >
                        <Typography>{nv.name}</Typography>
                        <Button
                          size="small"
                          variant={selectedStaffId === nv.id ? 'contained' : 'outlined'}
                          onClick={() => setSelectedStaffId(nv.id ?? null)}
                        >
                          {selectedStaffId === nv.id ? 'Đã chọn' : 'Chọn'}
                        </Button>
                      </Stack>
                    ))}
                  </>
                )}
              </Box>
              <Box sx={{ gridColumn: '1 / -1' }}>
                {selected.note ? (
                  <>
                    <Typography variant="caption" color="text.secondary">
                      Ghi chú
                    </Typography>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {selected.note}
                    </Typography>
                  </>
                ) : role === 'manager' ? (
                  <>
                    <Typography variant="caption" color="text.secondary">
                      Ghi chú
                    </Typography>
                    <TextField fullWidth multiline minRows={3} value={note} onChange={(e) => setNote(e.target.value)} />
                  </>
                ) : null}
              </Box>
            </Box>
          ) : null}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              setEditOpen(false);
              setSelectedStaffId(null);
              setNote('');
            }}
          >
            Đóng
          </Button>
          {role === 'manager' ? (
            <Button
              variant="contained"
              onClick={() => {
                handleSubmitState();
                setEditOpen(false);
                setSelectedStaffId(null);
                setNote('');
              }}
              disabled={selected?.status === 1}
            >
              Xác nhận liên hệ
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={() => {
                handleSubmitUpdate();
                setEditOpen(false);
                setSelectedStaffId(null);
              }}
            >
              Cập nhật
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default ContactList;
