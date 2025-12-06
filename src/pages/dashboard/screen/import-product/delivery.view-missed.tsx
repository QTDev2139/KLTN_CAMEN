import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  TableCell,
  TableRow,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import TableElement from '~/components/elements/table-element/table-element';
import {
  RequestImportPayload,
  ShortageResponse,
} from '~/apis/request-import/request-import.interface.api';
import { requestImportApi } from '~/apis';
import { formatDateTime } from '~/common/until/date-format.until';
import { TagElement } from '~/components/elements/tag/tag.element';
import { StatusLabelImport, NameLabelImport } from './import-product.status';
import { useProfile } from '~/hooks/use-profile/use-profile.hook';
import { useSnackbar } from '~/hooks/use-snackbar/use-snackbar';
import { StackRowJustBetween } from '~/components/elements/styles/stack.style';

type DeliveryViewMissedProps = {
  item?: RequestImportPayload;
  onClose?: () => void;
  onEdit?: (item: RequestImportPayload) => void;
  onReload?: (id?: number) => void;
};

const DeliveryViewMissed: React.FC<DeliveryViewMissedProps> = ({ item, onClose, onEdit, onReload }) => {
  const { palette } = useTheme();
  const { profile } = useProfile();
  const { snackbar } = useSnackbar();
  const [note, setNote] = useState<string>('');
  const [receivedQuantities, setReceivedQuantities] = useState<Record<number, number>>({});
  const [submitting, setSubmitting] = useState(false);

  const [missedProduct, setMissedProduct] = useState<ShortageResponse>();

  useEffect(() => {
    (async () => {
      const res = await requestImportApi.getImportRequestDetail(item?.id || 0);
      setMissedProduct(res);
    })();
  }, [item?.id]);

  // Khởi tạo giá trị receivedQuantities từ dữ liệu missing_items khi có dữ liệu
  useEffect(() => {
    if (!missedProduct?.missing_items) return;
    const init = (missedProduct.missing_items || []).reduce<Record<number, number>>((acc, it) => {
      acc[it.product_id] = it.missing_qty ?? 0;
      return acc;
    }, {});
    setReceivedQuantities(init);
  }, [missedProduct?.missing_items]);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const quantity_deliveries = (missedProduct?.missing_items || []).map((it) => ({
        product_id: it.product_id,
        received_qty: Number(receivedQuantities[it.product_id] ?? 0),
      }));

      const payload = {
        note,
        quantity_deliveries,
      };
      if (!missedProduct?.request_import?.id) return;
      await requestImportApi.updateMissedDelivery(missedProduct?.request_import?.id, payload);
      snackbar('success', 'Xác nhận đơn hàng thành công');
      onReload?.(missedProduct?.request_import?.id);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { id: 'index', label: 'STT', width: 60 },
    { id: 'product', label: 'Sản phẩm' },
    { id: 'product_id', label: 'Mã SP', width: 100 },
    { id: 'quantity', label: 'Số lượng thiếu', width: 200 },
    { id: 'send_qty', label: 'Số lượng gửi', width: 200 },
    { id: 'received_qty', label: 'Số lượng thực tế', width: 200 },
  ];

  const editable = item?.status === 'supplemented';

  return (
    <Stack>
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack>
                <Typography variant="h5">Chi tiết yêu cầu nhập hàng</Typography>
                <Typography variant="body2" color="text.secondary">
                  #{missedProduct?.request_import?.id ?? '-'} • Tạo:{' '}
                  {missedProduct?.request_import ? formatDateTime(missedProduct.request_import.created_at) : '-'}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1}>
                {missedProduct?.request_import && (
                  <TagElement
                    type={StatusLabelImport[missedProduct.request_import.status || 'pending'] || 'default'}
                    content={
                      NameLabelImport[missedProduct.request_import.status || 'pending'] ??
                      missedProduct.request_import.status ??
                      ''
                    }
                  />
                )}
                {profile?.role && profile.role.name !== 'storekeeper' && onEdit && item && (
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => onEdit(item)}
                    disabled={item?.status !== 'pending'}
                  >
                    Sửa
                  </Button>
                )}
                <Button size="small" variant="contained" onClick={onClose}>
                  Đóng
                </Button>
              </Stack>
            </Stack>

            <Divider sx={{ borderColor: palette.divider }} />

            <Stack direction="row" spacing={4}>
              <Box>
                <Typography variant="subtitle2">Người yêu cầu</Typography>
                <Typography>{missedProduct?.user?.name ?? '-'}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2">Cập nhật lúc</Typography>
                <Typography>
                  {missedProduct?.request_import ? formatDateTime(missedProduct.request_import.updated_at) : '-'}
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2">Ghi chú</Typography>
                <Typography sx={{ whiteSpace: 'pre-wrap' }}>{missedProduct?.request_import?.note ?? '-'}</Typography>
              </Box>
            </Stack>

            <Divider sx={{ borderColor: palette.divider }} />

            <Typography variant="subtitle1">Danh sách sản phẩm</Typography>

            <TableElement
              columns={columns}
              rows={missedProduct?.missing_items || []}
              renderRow={(row, idx) => {
                return (
                  <TableRow hover key={idx}>
                    <TableCell sx={{ width: 60, textAlign: 'center' }}>{idx + 1}</TableCell>
                    <TableCell>{row.product.name}</TableCell>
                    <TableCell sx={{ width: 100, textAlign: 'center' }}>{row.product_id}</TableCell>
                    <TableCell sx={{ textAlign: 'center', width: 200 }}>{row.missing_qty}</TableCell>
                    <TableCell sx={{ textAlign: 'center', width: 200 }}>{row.missing_qty}</TableCell>
                    <TableCell sx={{ textAlign: 'center', width: 200 }}>
                      <TextField
                        type="number"
                        size="small"
                        inputProps={{ min: 0 }}
                        value={receivedQuantities[row.product_id]}
                        onChange={(e) =>
                          setReceivedQuantities((prev) => ({
                            ...prev,
                            [row.product_id]: Number(e.target.value || 0),
                          }))
                        }
                        disabled={!editable}
                      />
                    </TableCell>
                  </TableRow>
                );
              }}
            />
          </Stack>
        </CardContent>
      </Card>
      <StackRowJustBetween
        sx={{
          position: 'absolute',
          bottom: 20,
          width: 'calc(100% - 400px)',
          backgroundColor: '#fff',
          boxShadow: '0 -5px 10px #cecece',
          padding: '10px 20px',
        }}
      >
        <Stack sx={{ width: '400px' }}>
          <Typography variant="subtitle2">Ghi chú</Typography>
          <TextField
            multiline
            minRows={2}
            maxRows={4}
            fullWidth
            name="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            disabled={!editable}
          />
        </Stack>
        <Box>
          <Button
            sx={{ height: '40px', mt: '30px' }}
            variant="contained"
            color="primary"
            disabled={submitting || !editable}
            onClick={handleSubmit}
          >
            {submitting ? 'Đang xác nhận...' : 'Xác nhận đơn hàng'}
          </Button>
        </Box>
      </StackRowJustBetween>
    </Stack>
  );
};

export default DeliveryViewMissed;
