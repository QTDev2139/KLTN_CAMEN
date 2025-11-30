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

type DeliveryViewProps = {
  item?: RequestImportPayload;
  onClose?: () => void;
  onEdit?: (item: RequestImportPayload) => void;
  onReload?: (id?: number) => void;
};

const DeliveryView: React.FC<DeliveryViewProps> = ({ item, onClose, onEdit, onReload }) => {
  const { palette } = useTheme();
  const [products, setProducts] = useState<Product[]>([]);
  const { profile } = useProfile();
  const { snackbar } = useSnackbar();
  const [note, setNote] = useState<string>('');
  const [receivedQuantities, setReceivedQuantities] = useState<Record<number, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [delivery, setDelivery] = useState<DeliveryDetail[] | undefined>([]);



  // original requested items (fallback)
  const items = (item?.items && item.items.length ? item.items : item?.quantity_imports) ?? [];

  const deliveryItems = useMemo(() => {
    if (!delivery || !Array.isArray(delivery)) return [];
    return delivery.flatMap((d) => d.quantity_deliveries ?? []);
  }, [delivery]);

  useEffect(() => {
    const fetchDeliveryDetail = async () => {
      if (!item?.id) return;
      try {
        const res = await requestImportApi.getDeliveryDetail(item.id);

        let list: DeliveryDetail[] = [];
        if (Array.isArray(res)) {
          list = res;
        } else if (res && typeof res === 'object') {
          if (Array.isArray((res as any).data)) list = (res as any).data;
          else if (Array.isArray((res as any).delivery_details)) list = (res as any).delivery_details;
          else if (Array.isArray((res as any).quantity_deliveries)) {
            list = [{ quantity_deliveries: (res as any).quantity_deliveries } as DeliveryDetail];
          } else {
            list = [res as DeliveryDetail];
          }
        }
        setDelivery(list);
      } catch (err) {
        console.error('fetchDeliveryDetail error', err);
      }
    };
    fetchDeliveryDetail();
  }, [item]);

  // initialize receivedQuantities: prefer deliveryItems (sent/received), fallback to original items
  useEffect(() => {
    const map: Record<number, number> = {};
    if (deliveryItems && deliveryItems.length) {
      deliveryItems.forEach((d) => {
        const pid = Number(d.product_id ?? 0);
        map[pid] = Number(d.received_qty ?? d.sent_qty ?? d.quantity ?? 0);
      });
    } else {
      (items || []).forEach((it: any) => {
        map[it.product_id] = Number(it.received_qty ?? it.quantity ?? 0);
      });
    }
    setReceivedQuantities(map);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item, delivery]);

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

  const productMap = useMemo(() => {
    const m = new Map<number, Product>();
    products.forEach((p) => {
      const id = (p as any).id as number;
      m.set(id, p);
    });
    return m;
  }, [products]);


  const handleSubmit = async () => {
    if (!item?.id) return;
    // only allow confirming when item is shipped
    if (item.status !== 'shipped') return;

    // prepare payload of confirmed quantities (use current receivedQuantities or defaults)
    const payloadItems = (deliveryItems.length ? deliveryItems : items).map((it: any) => ({
      product_id: it.product_id,
      quantity: it.quantity,
      sent_qty: it.sent_qty,
      received_qty: Number(receivedQuantities[it.product_id] ?? 0),
    }));

    // validation: require at least one received_qty > 0
    if (!payloadItems.some((pi) => Number(pi.received_qty) > 0)) {
      snackbar('error', 'Vui lòng nhập ít nhất 1 sản phẩm nhận được');
      return;
    }

    setSubmitting(true);
    try {
      const payload: Partial<DeliveryDetail> = {
        note: note || null,
        request_import_id: item.id,
        quantity_deliveries: payloadItems as any,
      };
      const deliveryId = deliveryItems[0]?.delivery_id;
      if (!deliveryId) return;
      
      await requestImportApi.updateDelivery(deliveryId, payload as DeliveryDetail);
      snackbar('success', 'Xác nhận nhận hàng thành công');
      onReload && onReload(item.id);
    } catch (err) {
      console.error(err);
      snackbar('error', 'Xác nhận nhận hàng thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { id: 'index', label: 'STT', width: 60 },
    { id: 'product', label: 'Sản phẩm' },
    { id: 'product_id', label: 'Mã SP', width: 100 },
    { id: 'quantity', label: 'Số lượng yêu cầu', width: 200 },
    { id: 'send_qty', label: 'Số lượng gửi', width: 200 },
    { id: 'received_qty', label: 'Số lượng thực tế', width: 200 },
  ];

  // allow editing received qty only when request is in "shipped" state (ready for confirmation)
  const editable = item?.status === 'shipped';

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
              rows={deliveryItems}
              renderRow={(row, idx) => {
                const productId = Number((row as any).product_id);
                const p = productMap.get(productId);
                const requestedQty = (row as any).quantity ?? '-';
                const sentQty = (row as any).sent_qty ?? (row as any).quantity ?? '-';
                return (
                  <TableRow hover key={idx}>
                    <TableCell sx={{ width: 60, textAlign: 'center' }}>{idx + 1}</TableCell>
                    <TableCell>{p ? p.product_translations?.[0]?.name ?? `#${productId}` : `#${productId}`}</TableCell>
                    <TableCell sx={{ width: 100, textAlign: 'center' }}>{productId}</TableCell>
                    <TableCell sx={{ textAlign: 'center', width: 200 }}>{requestedQty}</TableCell>
                    <TableCell sx={{ textAlign: 'center', width: 200 }}>{sentQty}</TableCell>
                    <TableCell sx={{ textAlign: 'center', width: 200 }}>
                      <TextField
                        type="number"
                        size="small"
                        inputProps={{ min: 0 }}
                        value={receivedQuantities[productId]}
                        onChange={(e) =>
                          setReceivedQuantities((prev) => ({
                            ...prev,
                            [productId]: Number(e.target.value || 0),
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

export default DeliveryView;
