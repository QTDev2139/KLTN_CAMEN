import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Stack,
  Chip,
  Divider,
  Button,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Grid,
  TextField,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { OrderDetail } from '~/apis/order/order.interface.api';
import { FormatPrice } from '~/components/elements/format-price/format-price.element';
import { formatDate } from '~/common/until/date-format.until';
import {
  paymentMethodMap,
  paymentStatusColorMap,
  paymentStatusLabelMap,
  statusColorMap,
  statusLabelMap,
} from '../order.state';
import { DetailRow } from '~/components/elements/table-element/row-element';

import Placeholder from '~/assets/images/placeholder.png';
import { StackRowJustBetween } from '~/components/elements/styles/stack.style';
import React, { useState } from 'react';
import { useSnackbar } from '~/hooks/use-snackbar/use-snackbar';
import { updateOrder } from '~/apis/order/order.api';
import { vnpayManualRefund } from '~/apis/payment/payment.api';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

type Props = {
  open: boolean;
  onClose: () => void;
  order: OrderDetail | null;
  editable?: boolean;
  onUpdateSuccess?: () => void; // Thêm prop này
};

export const statusUpdate: Record<string, string> = {
  pending: 'processing',
  processing: 'shipped',
  shipped: 'completed',
  completed: 'completed',
  cancelled: 'cancelled',
};

const OrderViewModal: React.FC<Props> = ({ open, onClose, order, editable = false, onUpdateSuccess }) => {
  const { snackbar } = useSnackbar();
  const [refundNote, setRefundNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [refundType, setRefundType] = useState<'02' | '03'>('02'); // '02' = toàn bộ, '03' = một phần
  const [refundAmount, setRefundAmount] = useState<string>('');

  React.useEffect(() => {
    if (order) {
      setRefundAmount(String(order.grand_total || ''));
      setRefundType('02');
    }
  }, [order]);
  if (!order) return null;
  const handleUpdate = async () => {
    try {
      const updatedOrder = await updateOrder(order.id, { status: statusUpdate[order.status] });
      snackbar('success', updatedOrder.message || 'Cập nhật đơn hàng thành công');
      if (onUpdateSuccess) {
        await onUpdateSuccess();
      }
      onClose();
    } catch (e) {
      console.error(e);
      snackbar('error', 'Cập nhật đơn hàng thất bại');
    }
  };

  const handleConfirmRefund = async () => {
    setLoading(true);
    try {
      const amountNum = parseFloat(refundAmount as any) || 0;
      if (refundType === '03' && (isNaN(amountNum) || amountNum < 1000)) {
        snackbar('error', 'Số tiền hoàn tối thiểu 1000');
        setLoading(false);
        return;
      }

      const payload = {
        code: order.code,
        trans_type: refundType,
        amount: amountNum,
        reason: refundNote || undefined,
      };
      console.log('refund payload', payload);
      const payRes = await vnpayManualRefund(payload);
      // tùy backend trả về gì, giả sử trả về success
      snackbar('success', payRes.message || 'Yêu cầu hoàn tiền đã gửi');

      // cập nhật trạng thái đơn hàng — điều chỉnh theo business rule
      const updatePayload: any = {
        reason_refund: refundNote,
      };
      if (refundType === '02') {
        updatePayload.status = 'refunded';
        updatePayload.refund_amount = amountNum || order.grand_total;
      } else {
        // partial: set refund amount and optionally a status like 'partially_refunded' hoặc keep 'processing'
        updatePayload.status = 'refunded';
        updatePayload.refund_amount = amountNum;
      }

      // console.log('updatePayload', updatePayload);
      await updateOrder(order.id, updatePayload);
      if (onUpdateSuccess) await onUpdateSuccess();
      onClose();
    } catch (e) {
      console.error(e);
      snackbar('error', 'Hoàn tiền thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleRejectRefund = async () => {
    setLoading(true);
    try {
      // Trả trạng thái về processing (hoặc thay đổi theo business rule)
      const res = await updateOrder(order.id, { status: 'refund_rejected', reason_refund: refundNote });
      snackbar('success', res.message || 'Đã từ chối hoàn tiền');
      if (onUpdateSuccess) await onUpdateSuccess();
      onClose();
    } catch (e) {
      console.error(e);
      snackbar('error', 'Thao tác thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Chi tiết đơn hàng</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          {/* Mã đơn hàng và trạng thái */}
          <Box>
            <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
              <Typography variant="h5" fontWeight={700} color="primary.main">
                {order.code}
              </Typography>
              <Chip
                label={statusLabelMap[order.status] || order.status}
                color={statusColorMap[order.status] || 'default'}
                sx={{ fontWeight: 600 }}
              />
              <Chip
                label={paymentStatusLabelMap[order.payment_status] || order.payment_status}
                color={paymentStatusColorMap[order.payment_status] || 'default'}
                variant="outlined"
                sx={{ fontWeight: 600 }}
              />
            </Stack>
          </Box>

          {/* Hiển thị thông tin hoàn tiền khi có yêu cầu hoặc đã hoàn */}
          {(order.status === 'refund_requested' || order.status === 'refunded') && (
            <Stack spacing={1}>
              <Divider />
              <Typography variant="subtitle2" fontWeight={600}>
                Hoàn tiền
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Lý do: {order.reason_refund || 'N/A'}
              </Typography>
              {/* <DetailRow label="Số tiền hoàn" value={FormatPrice(order.refund_amount)} /> */}
              {/* <DetailRow label="Mã giao dịch hoàn tiền" value={order.refund_transaction_code} /> */}
              {order.img_refund && order.img_refund.length > 0 && (
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Ảnh minh chứng
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {order.img_refund?.map((img, idx) => {
                      const imageSrc = img ? `${process.env.REACT_APP_BASE}storage/${img}` : Placeholder;
                      return (
                        <a
                          key={idx}
                          href={imageSrc}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ display: 'inline-block' }}
                        >
                          <Box
                            component="img"
                            src={imageSrc}
                            alt={`refund-${idx}`}
                            sx={{
                              width: 80,
                              height: 80,
                              objectFit: 'cover',
                              borderRadius: 1,
                              border: '1px solid',
                              borderColor: 'divider',
                            }}
                          />
                        </a>
                      );
                    })}
                    {/* Trường ghi chú cho admin khi xử lý hoàn tiền */}
                  </Box>
                    <Box sx={{ minWidth: 300, mt: 1 }}>
                      <TextField
                        fullWidth
                        label="Ghi chú"
                        placeholder="Nhập ghi chú xử lý hoàn tiền..."
                        multiline
                        minRows={2}
                        value={refundNote}
                        onChange={(e) => setRefundNote(e.target.value)}
                        size="small"
                      />
                      <Box sx={{ mt: 1, display: 'flex', gap: 1, alignItems: 'center' }}>
                        <ToggleButtonGroup
                          size="small"
                          value={refundType}
                          exclusive
                          onChange={(_, v) => v && setRefundType(v)}
                          aria-label="refund-type"
                        >
                          <ToggleButton value="02" aria-label="toàn bộ">Hoàn toàn bộ</ToggleButton>
                          <ToggleButton value="03" aria-label="một phần">Hoàn một phần</ToggleButton>
                        </ToggleButtonGroup>

                        {refundType === '03' && (
                          <TextField
                            label="Số tiền hoàn (VND)"
                            size="small"
                            value={refundAmount}
                            onChange={(e) => setRefundAmount(e.target.value.replace(/[^\d.]/g, ''))}
                            sx={{ width: 160 }}
                          />
                        )}
                      </Box>
                    </Box>
                </Box>
              )}
            </Stack>
          )}

          <Divider />

          {/* Thông tin chung */}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
                Thông tin đơn hàng
              </Typography>
              <Stack spacing={1}>
                <DetailRow label="Ngày tạo" value={formatDate(order.created_at)} />
                <DetailRow
                  label="Phương thức thanh toán"
                  value={paymentMethodMap[order.payment_method] || order.payment_method}
                />
                {order.transaction_code && <DetailRow label="Mã giao dịch" value={order.transaction_code} />}
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
                Thông tin giao hàng
              </Typography>
              <Box>
                {order.shipping_address && typeof order.shipping_address === 'object' ? (
                  <Stack spacing={0.5}>
                    <Typography variant="body2" fontWeight={600}>
                      {order.shipping_address.name}
                    </Typography>
                    <Typography variant="body2">{order.shipping_address.phone}</Typography>
                    {order.shipping_address.email && (
                      <Typography variant="body2">{order.shipping_address.email}</Typography>
                    )}
                    <Typography variant="body2">
                      {[
                        order.shipping_address.street,
                        order.shipping_address.ward,
                        order.shipping_address.district,
                        order.shipping_address.province,
                      ]
                        .filter(Boolean)
                        .join(', ')}
                    </Typography>
                  </Stack>
                ) : (
                  <Typography variant="body2">Chưa có thông tin địa chỉ giao hàng</Typography>
                )}
              </Box>
            </Grid>
          </Grid>

          <Divider />

          {/* Danh sách sản phẩm */}
          {order.order_items && order.order_items.length > 0 ? (
            <Box>
              <Typography variant="subtitle1" fontWeight={600}>
                Sản phẩm đã đặt ({order.order_items.length})
              </Typography>
              <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
                <Box sx={{ overflowX: 'auto' }}>
                  <Table size="small">
                    <TableHead sx={{ bgcolor: 'grey.100' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Sản phẩm</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 600 }}>
                          Số lượng
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>
                          Đơn giá
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>
                          Thành tiền
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {order.order_items.map((item, index) => (
                        <TableRow key={index} hover>
                          <TableCell>
                            <Stack direction="row" spacing={2} alignItems="center">
                              <Box
                                component="img"
                                src={
                                  `${process.env.REACT_APP_BASE}storage/${item.product?.product_images[0]?.image_url}` ||
                                  Placeholder
                                }
                                alt={item.product?.product_translations?.[0]?.name || 'Product'}
                                sx={{
                                  width: 60,
                                  height: 60,
                                  objectFit: 'cover',
                                  borderRadius: 1,
                                  border: '1px solid',
                                  borderColor: 'divider',
                                }}
                              />
                              <Box>
                                <Typography variant="body2" fontWeight={500}>
                                  {item.product?.product_translations?.[0]?.name || 'N/A'}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  ID: {item.product_id}
                                </Typography>
                              </Box>
                            </Stack>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2" fontWeight={500}>
                              {item.qty}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2">{FormatPrice(item.unit_price)}</Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight={600}>
                              {FormatPrice(item.subtotal)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </Paper>
            </Box>
          ) : (
            <Box>
              <Typography variant="subtitle1" fontWeight={600}>
                Sản phẩm đã đặt
              </Typography>
              <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Không có sản phẩm nào trong đơn hàng này
                </Typography>
              </Paper>
            </Box>
          )}

          <Divider />

          {/* Tổng kết đơn hàng */}
          <Box>
            <Stack spacing={1.5} alignItems="flex-end">
              <StackRowJustBetween sx={{ width: { xs: '100%', sm: 400 } }}>
                <Typography variant="body2">Tạm tính:</Typography>
                <Typography variant="body2" fontWeight={600}>
                  {FormatPrice(order.order_items.reduce((sum, item) => sum + parseFloat(item.subtotal), 0))}
                </Typography>
              </StackRowJustBetween>

              {order.coupon && typeof order.coupon === 'object' && (
                <StackRowJustBetween sx={{ width: { xs: '100%', sm: 400 } }}>
                  <Typography variant="body2">Mã giảm giá:</Typography>
                  <Chip label={(order.coupon as any).code} size="small" color="success" variant="outlined" />
                </StackRowJustBetween>
              )}

              {order.discount_total && parseFloat(order.discount_total) > 0 && (
                <StackRowJustBetween sx={{ width: { xs: '100%', sm: 400 } }}>
                  <Typography variant="body2">Giảm giá:</Typography>
                  <Typography variant="body2" fontWeight={600} color="success.main">
                    - {FormatPrice(order.discount_total)}
                  </Typography>
                </StackRowJustBetween>
              )}

              <Divider sx={{ width: { xs: '100%', sm: 400 } }} />

              <StackRowJustBetween
                sx={{
                  width: { xs: '100%', sm: 400 },
                  bgcolor: 'primary.lighter',
                  p: 2,
                  borderRadius: 1,
                }}
              >
                <Typography variant="h6" fontWeight={700}>
                  Tổng cộng:
                </Typography>
                <Typography variant="h6" fontWeight={700} color="primary.main">
                  {FormatPrice(order.grand_total)}
                </Typography>
              </StackRowJustBetween>
            </Stack>
          </Box>

          {/* Ghi chú */}
          {order.note && (
            <>
              <Divider />
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  Ghi chú
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                    {order.note}
                  </Typography>
                </Paper>
              </Box>
            </>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Đóng
        </Button>
        {editable && (
          <Button onClick={() => handleUpdate()} variant="contained" color="primary">
            Xác nhận đơn hàng
          </Button>
        )}
        {order.status === 'refund_requested' && (
          <>
            <Button onClick={handleRejectRefund} variant="outlined" color="inherit" disabled={loading}>
              Từ chối hoàn tiền
            </Button>
            <Button onClick={handleConfirmRefund} variant="contained" color="primary" disabled={loading}>
              Xác nhận hoàn tiền
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default OrderViewModal;
