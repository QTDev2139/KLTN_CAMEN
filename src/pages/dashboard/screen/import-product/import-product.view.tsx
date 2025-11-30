import React, { useEffect, useMemo, useState } from 'react';
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
import { DeliveryDetail, RequestImportPayload } from '~/apis/request-import/request-import.interface.api';
import { productApi, requestImportApi } from '~/apis';
import { Product } from '~/apis/product/product.interface.api';
import { formatDateTime } from '~/common/until/date-format.until';
import { TagElement } from '~/components/elements/tag/tag.element';
import { StatusLabelImport, NameLabelImport } from './import-product.status';
import { useProfile } from '~/hooks/use-profile/use-profile.hook';
import { useSnackbar } from '~/hooks/use-snackbar/use-snackbar';
import { StackRowJustBetween } from '~/components/elements/styles/stack.style';

type ImportProductViewProps = {
  item?: RequestImportPayload;
  onClose?: () => void;
  onEdit?: (item: RequestImportPayload) => void;
  onReload?: (id?: number) => void;
};

const ImportProductView: React.FC<ImportProductViewProps> = ({ item, onClose, onEdit, onReload }) => {
  const { palette } = useTheme();
  const [products, setProducts] = useState<Product[]>([]);
  const { profile } = useProfile();
  const { snackbar } = useSnackbar();
  const [note, setNote] = useState<string>('');
  const [receivedQuantities, setReceivedQuantities] = useState<Record<number, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const items = (item?.items && item.items.length ? item.items : item?.quantity_imports) ?? [];

  useEffect(() => {
    const map: Record<number, number> = {};
    (items || []).forEach((it: any) => {
      map[it.product_id] = Number(it.received_qty ?? it.quantity ?? 0);
    });
    setReceivedQuantities(map);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await productApi.getProduct('vi', 'domestic');
        setProducts(res);
      } catch (err) {
        console.error(err);
      }
    };
    fetch();
  }, []);

  const roleStorekeeper = profile?.role && profile.role.name === 'storekeeper';

  const productMap = useMemo(() => {
    const m = new Map<number, Product>();
    products.forEach((p) => {
      const id = (p as any).id as number;
      m.set(id, p);
    });
    return m;
  }, [products]);

  const handleUpdateStatus = async () => {
    if (!item?.id) return;
    setSubmitting(true);
    try {
      await requestImportApi.updateStatusImportRequest(item.id!, 'processing');
      snackbar('success', 'Cập nhật trạng thái thành công');
      onReload && onReload(item.id);
    } catch (err) {
      console.error(err);
      snackbar('error', 'Cập nhật trạng thái thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (!item?.id) return;
    setSubmitting(true);
    try {
      const payloadItems = (items || []).map((it: any) => ({
        product_id: it.product_id,
        quantity: it.quantity,
        sent_qty: Number(receivedQuantities[it.product_id] ?? 0),
      }));

      const payload: Partial<RequestImportPayload> = {
        note: note || null,
        request_import_id: item.id,

        quantity_imports: payloadItems as any,
      };
      await requestImportApi.createDelivery(item.id, payload as DeliveryDetail);
      await requestImportApi.updateStatusImportRequest(item.id!, 'shipped');
      snackbar('success', 'Gửi yêu cầu giao hàng thành công');
      onReload && onReload(item.id);
    } catch (err) {
      console.error(err);
      snackbar('error', 'Gửi yêu cầu giao hàng thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = useMemo(() => {
    const cols = [
      { id: 'index', label: 'STT', width: 60 },
      { id: 'product', label: 'Sản phẩm' },
      { id: 'product_id', label: 'Mã SP', width: 100 },
      { id: 'quantity', label: 'Số lượng yêu cầu', width: 200 },
    ];
    if (roleStorekeeper) {
      cols.push({ id: 'quantity_sent', label: 'Số lượng gửi', width: 200 });
    }
    return cols;
  }, [roleStorekeeper]);

  return (
    <Stack>
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack>
                <Typography variant="h5">Chi tiết yêu cầu nhập hàng</Typography>
                <Typography variant="body2" color="text.secondary">
                  #{item?.id ?? '-'} • Tạo: {item ? formatDateTime(item.created_at) : '-'}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1}>
                {item && (
                  <TagElement
                    type={StatusLabelImport[item.status || 'pending'] || 'default'}
                    content={NameLabelImport[item.status || 'pending'] ?? item.status ?? ''}
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
                <Typography>{item?.user?.name ?? '-'}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2">Cập nhật lúc</Typography>
                <Typography>{item ? formatDateTime(item.updated_at) : '-'}</Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2">Ghi chú</Typography>
                <Typography sx={{ whiteSpace: 'pre-wrap' }}>{item?.note ?? '-'}</Typography>
              </Box>
            </Stack>

            <Divider sx={{ borderColor: palette.divider }} />

            <Typography variant="subtitle1">Danh sách sản phẩm</Typography>

            <TableElement
              columns={columns}
              rows={items}
              renderRow={(row, idx) => {
                const p = productMap.get((row as any).product_id);
                return (
                  <TableRow hover key={idx}>
                    <TableCell sx={{ width: 60, textAlign: 'center' }}>{idx + 1}</TableCell>
                    <TableCell>
                      {p ? p.product_translations?.[0]?.name ?? `#${row.product_id}` : `#${row.product_id}`}
                    </TableCell>
                    <TableCell sx={{ width: 100, textAlign: 'center' }}>{row.product_id}</TableCell>
                    <TableCell sx={{ textAlign: 'center', width: 200 }}>{row.quantity}</TableCell>
                    <TableCell
                      sx={{ textAlign: 'center', width: 200, display: roleStorekeeper ? 'table-cell' : 'none' }}
                    >
                      <TextField
                        type="number"
                        size="small"
                        inputProps={{ min: 0 }}
                        value={receivedQuantities[(row as any).product_id] ?? 0}
                        onChange={(e) => {
                          const v = e.target.value === '' ? 0 : Math.max(0, parseInt(e.target.value, 10) || 0);
                          setReceivedQuantities((prev) => ({ ...prev, [(row as any).product_id]: v }));
                        }}
                        disabled={item?.status !== 'processing'}
                      />
                    </TableCell>
                  </TableRow>
                );
              }}
            />
          </Stack>
        </CardContent>
      </Card>
      {roleStorekeeper &&
        (() => {
          const canAction = item?.status === 'pending' || item?.status === 'processing';
          const actionLabel =
            item?.status === 'processing'
              ? 'Xác nhận giao hàng'
              : item?.status === 'pending'
              ? 'Duyệt yêu cầu'
              : 'Đã xử lý';
          if (!canAction) return null;
          return (
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
                  disabled={item?.status !== 'processing'}
                />
              </Stack>
              <Box>
                <Button
                  sx={{ height: '40px', mt: '30px' }}
                  variant="contained"
                  color="primary"
                  disabled={submitting}
                  onClick={item?.status === 'processing' ? handleSubmit : handleUpdateStatus}
                >
                  {submitting ? actionLabel : actionLabel}
                </Button>
              </Box>
            </StackRowJustBetween>
          );
        })()}
    </Stack>
  );
};

export default ImportProductView;
