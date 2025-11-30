import { CancelOutlined, DeleteOutline, ModeEditOutlineOutlined, VisibilityOutlined } from '@mui/icons-material';
import { IconButton, Stack, TableCell, TableRow, Tooltip, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { requestImportApi, userApi } from '~/apis';
import { RequestImportPayload } from '~/apis/request-import/request-import.interface.api';
import { formatDateTime } from '~/common/until/date-format.until';
import { getLimitLineCss } from '~/common/until/get-limit-line-css';
import { StackRowJustCenter } from '~/components/elements/styles/stack.style';
import TableElement from '~/components/elements/table-element/table-element';
import { TagElement } from '~/components/elements/tag/tag.element';
import { ModalConfirm } from '~/components/modal/modal-confirm/modal-confirm';
import { useSnackbar } from '~/hooks/use-snackbar/use-snackbar';
import { NameLabelImport, StatusLabelImport } from './import-product.status';
import { useProfile } from '~/hooks/use-profile/use-profile.hook';

type ListImportProductProps = {
  onEdit?: (item: RequestImportPayload) => void;
  onView?: (item: RequestImportPayload) => void;
  onViewDelivery?: (item: RequestImportPayload) => void;
  onViewMissed?: (item: RequestImportPayload) => void;
  onViewDeliveryMissed?: (item: RequestImportPayload) => void;
};

const ListImportProduct: React.FC<ListImportProductProps> = ({
  onEdit,
  onView,
  onViewDelivery,
  onViewMissed,
  onViewDeliveryMissed,
}) => {
  const { snackbar } = useSnackbar();
  const [listProduct, setListProduct] = useState<RequestImportPayload[]>([]);

  const [openConfirm, setOpenConfirm] = useState(false);
  const [openConfirmCancel, setOpenConfirmCancel] = useState(false);
  const [selected, setSelected] = useState<RequestImportPayload | null>(null);

  const { profile } = useProfile();

  const handleDelete = async (item: RequestImportPayload) => {
    await requestImportApi.deleteImportRequest(item.id!);
    const res = await requestImportApi.getImportRequests();
    setListProduct(res);
    snackbar('success', 'Xóa yêu cầu nhập hàng thành công');
  };

  const handleCancel = async (item: RequestImportPayload) => {
    await requestImportApi.updateStatusImportRequest(item.id!, 'cancelled');
    const res = await requestImportApi.getImportRequests();
    setListProduct(res);
    snackbar('success', 'Hủy yêu cầu nhập hàng thành công');
  };

  useEffect(() => {
    (async () => {
      const res = await requestImportApi.getImportRequests();
      setListProduct(res);
    })();
  }, []);

  const columns = [
    { id: 'index', label: 'STT', width: 40 },
    { id: 'date', label: 'Thời gian tạo' },
    { id: 'name', label: 'Người yêu cầu', width: 140 },
    { id: 'status', label: 'Trạng thái' },
    { id: 'note', label: 'Ghi chú' },
    { id: 'updated_at', label: 'Thời gian cập nhật cuối' },
    { id: 'action', label: 'Action', width: 160 },
  ];

  return (
    <Stack>
      <TableElement
        columns={columns}
        rows={listProduct}
        renderRow={(cat, idx) => {
          return (
            <TableRow hover key={idx}>
              <TableCell sx={{ width: 40 }}>
                <Typography sx={{ textAlign: 'center' }}>{idx + 1}</Typography>
              </TableCell>
              <TableCell>
                <Typography textAlign={'center'}>{formatDateTime(cat.created_at)}</Typography>
              </TableCell>
              <TableCell>
                <Typography>{cat.user?.name}</Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ textAlign: 'center' }}>
                  <TagElement
                    type={StatusLabelImport[cat.status || 'pending'] || 'default'}
                    content={NameLabelImport[cat.status || 'đang chờ'] || ''}
                  />
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ ...getLimitLineCss(1) }}>{cat.note}</Typography>
              </TableCell>
              <TableCell>
                <Typography textAlign={'center'}>{formatDateTime(cat.updated_at)}</Typography>
              </TableCell>

              <TableCell sx={{ position: 'sticky', right: 0, backgroundColor: 'background.default' }}>
                <StackRowJustCenter sx={{ width: '100%', cursor: 'pointer' }}>
                  {profile?.role && profile?.role.name !== 'storekeeper' && cat.status === 'shipped' ? (
                    <Tooltip title="Xem">
                      <IconButton
                        size="small"
                        onClick={() => {
                          onViewDelivery && onViewDelivery(cat);
                        }}
                      >
                        <VisibilityOutlined fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  ) : profile?.role && profile?.role.name === 'storekeeper' && cat.status === 'partially' ? (
                    <Tooltip title="Xem">
                      <IconButton
                        size="small"
                        onClick={() => {
                          onViewMissed && onViewMissed(cat);
                        }}
                      >
                        {/* <VisibilityOutlined fontSize="small" /> */}
                        lol
                      </IconButton>
                    </Tooltip>
                  ) : profile?.role && profile?.role.name !== 'storekeeper' && cat.status === 'supplemented' ? (
                    <Tooltip title="Xem">
                      <IconButton
                        size="small"
                        onClick={() => {
                          onViewDeliveryMissed && onViewDeliveryMissed(cat);
                        }}
                      >
                        {/* <VisibilityOutlined fontSize="small" /> */}
                        aka
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Xem">
                      <IconButton
                        size="small"
                        onClick={() => {
                          onView && onView(cat);
                        }}
                      >
                        <VisibilityOutlined fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}

                  {profile?.role && profile?.role.name !== 'storekeeper' && (
                    <>
                      <Tooltip title="Sửa">
                        <span>
                          <IconButton
                            size="small"
                            onClick={() => {
                              onEdit && onEdit(cat);
                            }}
                            disabled={cat.status !== 'pending'}
                          >
                            <ModeEditOutlineOutlined fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>

                      <Tooltip title="Xóa">
                        <span>
                          <IconButton
                            size="small"
                            onClick={() => {
                              setSelected(cat);
                              setOpenConfirm(true);
                            }}
                            disabled={cat.status !== 'pending'}
                          >
                            <DeleteOutline fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title="Hủy">
                        <span>
                          <IconButton
                            size="small"
                            onClick={() => {
                              setSelected(cat);
                              setOpenConfirmCancel(true);
                            }}
                            disabled={cat.status !== 'pending'}
                          >
                            <CancelOutlined fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </>
                  )}
                </StackRowJustCenter>
              </TableCell>
            </TableRow>
          );
        }}
      />

      <ModalConfirm
        open={openConfirm}
        title="Xóa yêu cầu nhập hàng"
        message={`Bạn có chắc muốn xóa yêu cầu nhập hàng này không?`}
        onClose={() => setOpenConfirm(false)}
        onConfirm={() => {
          if (selected) {
            handleDelete(selected);
            setOpenConfirm(false);
            setSelected(null);
          }
        }}
      />
      <ModalConfirm
        open={openConfirmCancel}
        title="Hủy yêu cầu nhập hàng"
        message={`Bạn có chắc muốn hủy yêu cầu nhập hàng này không?`}
        onClose={() => setOpenConfirmCancel(false)}
        onConfirm={() => {
          if (selected) {
            handleCancel(selected);
            setOpenConfirmCancel(false);
            setSelected(null);
          }
        }}
      />
    </Stack>
  );
};

export default ListImportProduct;
