import React, { useEffect, useState, useMemo } from 'react';
import { Box, Typography, Divider, Stack, Button, useTheme, Badge } from '@mui/material';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { StackRowJustBetween, StackRowJustEnd, StackRowAlignCenter, StackRow } from '~/components/elements/styles/stack.style';
import { OrderDetail } from '~/apis/order/order.interface.api';
import { getUserOrders, updateOrder } from '~/apis/order/order.api';
import { useLang } from '~/hooks/use-lang/use-lang';
import { useSnackbar } from '~/hooks/use-snackbar/use-snackbar';
import { FormatPrice } from '~/components/elements/format-price/format-price.element';
import { TagElement } from '~/components/elements/tag/tag.element';
import { statusLabelMap, statusColorMap } from '~/pages/dashboard/screen/orders/order.state';
import { ModalConfirm } from '~/components/modal/modal-confirm/modal-confirm';
import { statusUpdate } from '~/pages/dashboard/screen/orders/view/order-view';
import ReviewModal from './review-modal';

// Bộ lọc trạng thái đơn hàng
const ORDER_FILTERS = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Chờ xác nhận', value: 'pending' },
  { label: 'Đang chuẩn bị hàng', value: 'processing' },
  { label: 'Đang vận chuyển', value: 'shipped' },
  { label: 'Hoàn thành', value: 'completed' },
  { label: 'Đã hủy', value: 'cancelled' },
];

const PurchasePage: React.FC = () => {
  const lang = useLang();
  const { snackbar } = useSnackbar();
  const [orders, setOrders] = useState<OrderDetail[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const { palette } = useTheme();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
  const [loadingCancel, setLoadingCancel] = useState(false);
  const [loadingConfirm, setLoadingConfirm] = useState(false);
  const [openReview, setOpenReview] = useState(false);
  const [reviewOrder, setReviewOrder] = useState<OrderDetail | null>(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const data = await getUserOrders(lang);
        setOrders(data);
      } catch {
        snackbar('error', 'Không lấy được danh sách đơn hàng');
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [lang, snackbar]);

  const filteredOrders = useMemo(
    () => (activeFilter === 'all' ? orders : orders.filter((o) => o.status === activeFilter)),
    [orders, activeFilter],
  );

  // Thêm counts cho badge
  const filterCounts = useMemo(() => {
    const counts: Record<string, number> = { all: orders?.length || 0 };
    (ORDER_FILTERS || []).forEach((f) => {
      if (f.value === 'all') return;
      counts[f.value] = (orders || []).filter((o) => o.status === f.value).length;
    });
    return counts;
  }, [orders]);
  console.log(orders)
  const handleCancelClick = (order: OrderDetail) => {
    setSelectedOrder(order);
    setOpenConfirm(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedOrder) return;
    
    setLoadingCancel(true);
    try {
      await updateOrder(selectedOrder.id, { status: "cancelled" });
      snackbar('success', `Đã hủy đơn hàng #${selectedOrder.code}`);
      
      // Refresh lại danh sách
      const data = await getUserOrders(lang);
      setOrders(data);
      setOpenConfirm(false);
      setSelectedOrder(null);
    } catch (e) {
      console.error(e);
      snackbar('error', 'Hủy đơn hàng thất bại');
    } finally {
      setLoadingCancel(false);
    }
  };

  const handleConfirmClick = (order: OrderDetail) => {
    setSelectedOrder(order);
    setOpenConfirm(true);
  };

  const handleConfirmOrder = async () => {
    if (!selectedOrder) return;
    
    setLoadingConfirm(true);
    try {
      await updateOrder(selectedOrder.id, { status: statusUpdate[selectedOrder.status] });
      snackbar('success', `Đã xác nhận hoàn thành đơn hàng #${selectedOrder.code}`);
      
      // Refresh lại danh sách
      const data = await getUserOrders(lang);
      setOrders(data);
      setOpenConfirm(false);
      setSelectedOrder(null);
    } catch (e) {
      console.error(e);
      snackbar('error', 'Xác nhận hoàn thành thất bại');
    } finally {
      setLoadingConfirm(false);
    }
  };
  return (
    <React.Fragment>
      <StackRowAlignCenter columnGap={2} sx={{ mb: 2, flexWrap: 'wrap', position: 'relative', userSelect: 'none' }}>
        {ORDER_FILTERS.map((f) => {
          const active = activeFilter === f.value;
          const SHOW_BADGE_FOR = ['pending', 'processing', 'shipped'];
          return (
            <Box
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              sx={{
                px: 2,
                py: 0.75,
                cursor: 'pointer',
                color: active ? 'primary.main' : 'text.primary',
                position: 'relative',
                '&:hover': { color: 'primary.main' },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  bottom: 0,
                  height: 2,
                  width: '100%',
                  backgroundColor: active ? 'primary.main' : 'transparent',
                  transition: 'background-color .25s ease',
                },
              }}
            >
              <Badge
                badgeContent={filterCounts[f.value] ?? 0}
                color="primary"
                invisible={!(SHOW_BADGE_FOR.includes(f.value) && (filterCounts[f.value] ?? 0) > 0)}
                sx={{ '& .MuiBadge-badge': { fontSize: 11, minWidth: 20, height: 20 } }}
              >
                <Typography variant="subtitle2" fontWeight={600} sx={{ minWidth: 90, textAlign: 'center' }}>
                  {f.label}
                </Typography>
              </Badge>
            </Box>
          );
        })}
      </StackRowAlignCenter>

      {/* {loading && (
        <Typography variant="body2" sx={{ mb: 2 }}>
          Đang tải...
        </Typography>
      )} */}

      {!loading && filteredOrders.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          Không có đơn hàng
        </Typography>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {filteredOrders.map((order) => {
          const items = Array.isArray(order.order_items) ? order.order_items : (order as any).items || [];
          return (
            <Box
              key={order.id}
              sx={{
                p: 2,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
              }}
            >
              {/* Mã đơn */}
              <StackRowJustBetween
                sx={{
                  alignItems: 'flex-start',
                  mb: 1,
                }}
              >
                <Typography fontWeight={700}>Mã đơn: {order.code}</Typography>
                <TagElement
                  type={statusColorMap[order.status] || 'default'}
                  content={statusLabelMap[order.status] || order.status}
                  width={150}
                />
              </StackRowJustBetween>

              <Divider sx={{ mb: 1 }} />

              {/* Danh sách sản phẩm */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {items.length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    Không có sản phẩm
                  </Typography>
                )}
                {items.map((item: any) => {
                  const name = item.product?.product_translations[0]?.name;
                  const qty = item.quantity ?? item.qty ?? 1;
                  const unitPrice = item.product?.price;
                  return (
                    <StackRowAlignCenter
                      key={item.id || `${order.id}-${name}-${qty}-${unitPrice}`}
                      sx={{
                        gap: 2,
                        py: 0.75,
                      }}
                    >
                      <StackRow gap={2} flexGrow={1}>
                        <img src={item.product?.product_images[0]?.image_url || ''} alt={name} style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }} />
                        <Stack>
                          <Typography variant="body2" fontWeight={600}>
                            {name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            SL: {qty}
                          </Typography>
                        </Stack>
                      </StackRow>
                      <Typography variant="body2" fontWeight={700}>
                        {FormatPrice(unitPrice)}
                      </Typography>
                    </StackRowAlignCenter>
                  );
                })}
              </Box>

              <Divider sx={{ mt: 1, mb: 1 }} />

              {/* Tổng tiền đơn */}
              <StackRowJustEnd>
                <Typography fontWeight={700}>Tổng đơn: <span style={{ color: palette.primary.main }}>{FormatPrice(order.grand_total)}</span></Typography>
              </StackRowJustEnd>

              {/* Các nút thao tác */}
              <StackRowJustEnd sx={{ mt: 2, gap: 2 }}>
                {order.status === 'shipped' ? (
                  <Button
                    variant="outlined"
                    color="success"
                    startIcon={<CheckCircleOutlineIcon />}
                    onClick={() => handleConfirmClick(order)}
                  >
                    Đã nhận hàng
                  </Button>
                ) : order.status === 'completed' ? (
                  <>
                    {order.order_items[0]?.review === null && (
                      <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<RateReviewOutlinedIcon />}
                        onClick={() => {
                          setReviewOrder(order);
                          setOpenReview(true);
                        }}
                      >
                        Đánh giá
                      </Button>
                    )}
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<ShoppingCartOutlinedIcon />}
                      onClick={() => {
                        snackbar('info', `Mua lại đơn hàng #${order.code}`);
                        // TODO: Gọi API mua lại
                      }}
                    >
                      Mua lại
                    </Button>
                  </>
                ) : order.status === 'cancelled' ? (
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<ShoppingCartOutlinedIcon />}
                    onClick={() => {
                      snackbar('info', `Mua lại đơn hàng #${order.code}`);
                      // TODO: Gọi API mua lại
                    }}
                  >
                    Mua lại
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<CancelOutlinedIcon />}
                    disabled={order.status === 'cancelled' || order.status === 'processing'}
                    onClick={() => handleCancelClick(order)}
                  >
                    Hủy đơn
                  </Button>
                )}
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<ChatOutlinedIcon />}
                  onClick={() => {
                    snackbar('info', `Liên hệ người bán đơn #${order.code}`);
                    // TODO: Mở chat hoặc redirect
                  }}
                >
                  Liên hệ người bán
                </Button>
              </StackRowJustEnd>
              
            </Box>
          );
        })}
      </Box>

      {/* Review modal */}
      <ReviewModal
        open={openReview}
        onClose={() => {
          setOpenReview(false);
        }}
        order={reviewOrder}
        onSubmitted={async () => {
            const data = await getUserOrders(lang);
            setOrders(data);
            setReviewOrder(null);
        }}
      />

      <ModalConfirm
        open={openConfirm}
        title="Xác nhận hủy đơn hàng"
        message={`Bạn có chắc muốn hủy đơn hàng "${selectedOrder?.code}" không?`}
        onClose={() => {
          setOpenConfirm(false);
          setSelectedOrder(null);
        }}
        onConfirm={handleConfirmCancel}
        loading={loadingCancel}
      />
      <ModalConfirm
        open={openConfirm}
        title="Xác nhận hoàn thành đơn hàng"
        message={`Bạn có chắc muốn xác nhận hoàn thành đơn hàng "${selectedOrder?.code}" không?`}
        onClose={() => {
          setOpenConfirm(false);
          setSelectedOrder(null);
        }}
        onConfirm={handleConfirmOrder}
        loading={loadingConfirm}
      />
    </React.Fragment>
  );
};

export default PurchasePage;
