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
import {  requestImportApi } from '~/apis';
import { formatDateTime } from '~/common/until/date-format.until';
import { TagElement } from '~/components/elements/tag/tag.element';
import { StatusLabelImport, NameLabelImport } from './import-product.status';
import { useProfile } from '~/hooks/use-profile/use-profile.hook';
import { useSnackbar } from '~/hooks/use-snackbar/use-snackbar';
import { StackRowJustEnd } from '~/components/elements/styles/stack.style';

type ImportProductViewMissedProps = {
  item?: RequestImportPayload;
  onClose?: () => void;
  onEdit?: (item: RequestImportPayload) => void;
  onReload?: (id?: number) => void;
};

const ImportProductViewMissed: React.FC<ImportProductViewMissedProps> = ({ item, onClose, onEdit, onReload }) => {
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

  // initialize receivedQuantities with defaults from missing_items (use missing_qty as default)
  useEffect(() => {
    if (!missedProduct?.missing_items) return;
    const map: Record<number, number> = {};
    missedProduct.missing_items.forEach((it: any) => {
      map[it.product_id] = Number(it.sent_qty ?? it.missing_qty ?? 0);
    });
    setReceivedQuantities(map);
  }, [missedProduct]);

  const handleSubmit = async () => {
    if (!item?.id) return;
    setSubmitting(true);
    try {
      const payloadItems = missedProduct?.missing_items.map((it: any) => ({
        product_id: it.product_id,
        quantity: it.missing_qty,
        sent_qty: Number(receivedQuantities[it.product_id] ?? it.sent_qty ?? it.missing_qty ?? 0),
      }));

      const payload: Partial<RequestImportPayload> = {
        note: note || null,
        request_import_id: item.id,

        quantity_imports: payloadItems as any,
      };
      // await requestImportApi.createDelivery(item.id, payload as DeliveryDetail);
      await requestImportApi.updateStatusImportRequest(item.id!, 'supplemented');
      snackbar('success', 'Gửi yêu cầu giao hàng thành công');
      onReload && onReload(item.id);
    } catch (err) {
      console.error(err);
      snackbar('error', 'Gửi yêu cầu giao hàng thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { id: 'index', label: 'STT', width: 60 },
    { id: 'product', label: 'Sản phẩm' },
    { id: 'product_id', label: 'Mã SP', width: 100 },
    { id: 'quantity', label: 'Số lượng thiếu hụt', width: 200 },
    { id: 'quantity_sent', label: 'Số lượng gửi bổ sung', width: 200 },
  ];

  return (
    <Stack>
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack>
                <Typography variant="h5">Chi tiết yêu cầu nhập hàng bổ sung</Typography>
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
                <Typography variant="subtitle2">Người tạo</Typography>
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
                    <TableCell>#{row.product.name}</TableCell>
                    <TableCell sx={{ width: 100, textAlign: 'center' }}>{row.product_id}</TableCell>
                    <TableCell sx={{ textAlign: 'center', width: 200 }}>{row.missing_qty}</TableCell>
                    <TableCell sx={{ textAlign: 'center', width: 200 }}>
                      <TextField
                        disabled
                        type="number"
                        size="small"
                        inputProps={{ min: 0 }}
                        // use existing entered value, otherwise default to row.missing_qty (or 0)
                        value={
                          receivedQuantities[(row as any).product_id] ??
                          (Number.isFinite(Number((row as any).missing_qty)) ? Number((row as any).missing_qty) : 0)
                        }
                        onChange={(e) => {
                          const v = e.target.value === '' ? 0 : Math.max(0, parseInt(e.target.value, 10) || 0);
                          setReceivedQuantities((prev) => ({ ...prev, [(row as any).product_id]: v }));
                        }}
                      />
                    </TableCell>
                  </TableRow>
                );
              }}
            />
          </Stack>
        </CardContent>
      </Card>
      <StackRowJustEnd
        sx={{
          position: 'absolute',
          bottom: 20,
          width: 'calc(100% - 400px)',
          backgroundColor: '#fff',
          boxShadow: '0 -5px 10px #cecece',
          padding: '10px 20px',
        }}
      >
        <Stack sx={{ width: '400px', display: 'none' }}>
          <Typography variant="subtitle2">Ghi chú</Typography>
          <TextField
            multiline
            minRows={2}
            maxRows={4}
            fullWidth
            name="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </Stack>
        <Box>
          <Button
            sx={{ height: '40px' }}
            variant="contained"
            color="primary"
            disabled={submitting}
            onClick={handleSubmit}
          >
            {submitting ? 'Gửi hàng' : 'Gửi hàng'}
          </Button>
        </Box>
      </StackRowJustEnd>
    </Stack>
  );
};

export default ImportProductViewMissed;
