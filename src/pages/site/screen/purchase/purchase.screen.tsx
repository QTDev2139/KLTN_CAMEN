import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Box, Typography, Divider, Stack, Button, useTheme, Badge, Drawer, IconButton, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import {
  StackRowJustBetween,
  StackRowJustEnd,
  StackRowAlignCenter,
  StackRow,
} from '~/components/elements/styles/stack.style';
import { OrderDetail } from '~/apis/order/order.interface.api';
import { getUserOrders, updateOrder } from '~/apis/order/order.api';
import { useLang } from '~/hooks/use-lang/use-lang';
import { useSnackbar } from '~/hooks/use-snackbar/use-snackbar';
import { FormatPrice } from '~/components/elements/format-price/format-price.element';
import { TagElement } from '~/components/elements/tag/tag.element';
import {
  statusLabelMap,
  statusColorMap,
  paymentStatusColorMap,
  paymentStatusLabelMap,
} from '~/pages/dashboard/screen/orders/order.state';
import { ModalConfirm } from '~/components/modal/modal-confirm/modal-confirm';
import { statusUpdate } from '~/pages/dashboard/screen/orders/view/order-view';
import ReviewModal from './review-modal';
import { orderApi, paymentApi } from '~/apis';
import { getLangPrefix } from '~/common/constant/get-lang-prefix';
import { Cached, DeleteOutline } from '@mui/icons-material';
import { ModalElement } from '~/components/modal/modal-element/modal-element';
import ContainerWrapper from '~/components/elements/container/container.element';
import { PADDING_GAP_LAYOUT } from '~/common/constant/style.constant';

// Bộ lọc trạng thái đơn hàng
const ORDER_FILTERS = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Chờ xác nhận', value: 'pending' },
  { label: 'Đang chuẩn bị hàng', value: 'processing' },
  { label: 'Đang vận chuyển', value: 'shipped' },
  { label: 'Hoàn thành', value: 'completed' },
  { label: 'Đã hủy', value: 'cancelled' },
  { label: 'Hoàn tiền', value: 'refunded' },
];

const PurchasePage: React.FC = () => {
  const lang = useLang();
  const { snackbar } = useSnackbar();
  const [orders, setOrders] = useState<OrderDetail[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const { palette } = useTheme();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openConfirmCancel, setOpenConfirmCancel] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
  const [loadingCancel, setLoadingCancel] = useState(false);
  const [loadingConfirm, setLoadingConfirm] = useState(false);
  const [openReview, setOpenReview] = useState(false);
  const [reviewOrder, setReviewOrder] = useState<OrderDetail | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [refundReason, setRefundReason] = useState<OrderDetail | null>(null);

  // NEW: refund form state + file handling
  const MAX_REFUND_IMAGES = 5;
  const [refundComment, setRefundComment] = useState<string>('');
  const [refundImages, setRefundImages] = useState<File[]>([]);
  const [refundPreviews, setRefundPreviews] = useState<string[]>([]);
  const refundInputRef = useRef<HTMLInputElement | null>(null);
  const [refundErrors, setRefundErrors] = useState<{ comment?: string; images?: string }>({});

  // --- NEW: detail drawer state ---
  const [openDetail, setOpenDetail] = useState(false);
  const [detailOrder, setDetailOrder] = useState<OrderDetail | null>(null);
  const openOrderDetail = (order: OrderDetail) => {
    setDetailOrder(order);
    setOpenDetail(true);
  };
  const closeOrderDetail = () => {
    setOpenDetail(false);
    setDetailOrder(null);
  };
  // --- END NEW ---

  const currentLang = useLang();
  const prefix = getLangPrefix(currentLang);

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

  const filteredOrders = useMemo(() => {
    if (activeFilter === 'all') return orders;
    if (activeFilter === 'refunded') {
      return (orders || []).filter((o) => o.status === 'refund_requested' || o.status === 'refunded');
    }
    return (orders || []).filter((o) => o.status === activeFilter);
  }, [orders, activeFilter]);

  // Thêm counts cho badge
  const filterCounts = useMemo(() => {
    const counts: Record<string, number> = { all: orders?.length || 0 };
    (ORDER_FILTERS || []).forEach((f) => {
      if (f.value === 'all') return;
      if (f.value === 'refunded') {
        counts[f.value] = orders.filter((o) => o.status === 'refund_requested' || o.status === 'refunded').length;
      } else {
        counts[f.value] = orders.filter((o) => o.status === f.value).length;
      }
    });
    return counts;
  }, [orders]);

  const handleCancelClick = (order: OrderDetail) => {
    setSelectedOrder(order);
    setOpenConfirmCancel(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedOrder) return;

    setLoadingCancel(true);
    try {
      await updateOrder(selectedOrder.id, { status: 'cancelled' });
      if (selectedOrder.payment_status === 'paid' && selectedOrder.payment_method === 'vnpay') {
        await paymentApi.vnpayAutoRefund({ code: selectedOrder.code });
      }
      snackbar('success', `Đã hủy đơn hàng #${selectedOrder.code}`);
      // Refresh lại danh sách
      const data = await getUserOrders(lang);
      setOrders(data);
      setOpenConfirmCancel(false);
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

  // Xác nhận hoàn thành đơn hàng
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

  const rePayment = async (order: OrderDetail) => {
    const result = await paymentApi.createPayment({
      amount: Number(order.grand_total),
      order_id: order.code,
      order_info: `Thanh toán đơn hàng #${order.code}`,
      bank_code: 'NCB',
      return_url: `${window.location.origin}${prefix}/payment`, // Frontend URL
    });
    // Redirect đến VNPay
    window.location.href = result.data?.payment_url;
  };

  useEffect(() => {
    if (!openModal) {
      refundImages.forEach(() => {});
      refundPreviews.forEach((u) => URL.revokeObjectURL(u));
      setRefundImages([]);
      setRefundPreviews([]);
      setRefundComment('');
    } else {
      setRefundComment('');
      setRefundImages([]);
      setRefundPreviews([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openModal]);

  const handleRefundFiles = (files: FileList | null) => {
    if (!files) return;
    const list = Array.from(files).filter((f) => f.type.startsWith('image/'));
    const remaining = Math.max(0, MAX_REFUND_IMAGES - refundImages.length);
    const toAdd = list.slice(0, remaining);
    if (toAdd.length === 0) {
      snackbar('warning', `Chỉ được chọn tối đa ${MAX_REFUND_IMAGES} ảnh`);
      return;
    }
    const newPreviews = toAdd.map((f) => URL.createObjectURL(f));
    setRefundImages((prev) => [...prev, ...toAdd]);
    setRefundPreviews((prev) => [...prev, ...newPreviews]);
    setRefundErrors((prev) => ({ ...prev, images: undefined }));
  };

  const handleRemoveRefundImage = (index: number) => {
    const removed = refundPreviews[index];
    if (removed) URL.revokeObjectURL(removed);
    setRefundImages((prev) => prev.filter((_, i) => i !== index));
    setRefundPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePickRefund = () => {
    if (refundInputRef.current) refundInputRef.current.click();
  };

  const handleConfirmRefund = async () => {
    const errors: { comment?: string; images?: string } = {};
    if (!refundComment || refundComment.trim() === '') errors.comment = 'Vui lòng nhập lý do hoàn tiền';
    if (refundImages.length === 0) errors.images = 'Vui lòng chọn ít nhất 1 ảnh minh chứng';
    if (Object.keys(errors).length > 0) {
      setRefundErrors(errors);
      snackbar('warning', errors.comment || errors.images || 'Vui lòng kiểm tra thông tin');
      return;
    }
    if (!refundReason) return;
    try {
      const formData = new FormData();
      formData.append('order_code', String(refundReason.code));
      formData.append('reason_refund', refundComment);

      refundImages.forEach((f, i) => formData.append('images[]', f, f.name));

      const res = await orderApi.requestOrderRefund(formData);
      snackbar('success', res?.message || 'Yêu cầu hoàn tiền đã gửi');

      setOpenModal(false);
      setRefundReason(null);
      const data = await getUserOrders(lang);
      setOrders(data);
    } catch (e) {
      console.error(e);
      snackbar('error', 'Gửi yêu cầu hoàn tiền thất bại');
    }
  };

  return (
    <ContainerWrapper sx={{ padding: PADDING_GAP_LAYOUT }}>
      <StackRowAlignCenter columnGap={2} sx={{ mb: 2, flexWrap: 'wrap', position: 'relative', userSelect: 'none' }}>
        {ORDER_FILTERS.map((f) => {
          const active = activeFilter === f.value;
          const SHOW_BADGE_FOR = ['pending', 'processing', 'shipped', 'refunded'];
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
              onClick={() => openOrderDetail(order)}
              sx={{
                p: 2,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
                cursor: 'pointer',
              }}
            >
              {/* Mã đơn */}
              <StackRowJustBetween
                sx={{
                  alignItems: 'flex-start',
                  mb: 1,
                }}
              >
                <StackRow gap={2}>
                  <Typography fontWeight={700}>Mã đơn: {order.code}</Typography>
                  <TagElement
                    type={paymentStatusColorMap[order.payment_status] || 'default'}
                    content={paymentStatusLabelMap[order.payment_status] || order.payment_status}
                    width={150}
                  />
                </StackRow>
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
                        <img
                          src={item.product?.product_images[0]?.image_url || ''}
                          alt={name}
                          style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
                        />
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

              {/* Phí giao hàng */}
              {order.ship_fee && Number(order.ship_fee) > 0 && (
                <StackRowJustEnd sx={{ mb: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    Phí giao hàng: <span style={{ fontWeight: 600 }}>{FormatPrice(order.ship_fee)}</span>
                  </Typography>
                </StackRowJustEnd>
              )}

              {/* Tổng tiền đơn */}
              <StackRowJustEnd>
                <Typography fontWeight={700}>
                  Tổng đơn: <span style={{ color: palette.primary.main }}>{FormatPrice(order.grand_total)}</span>
                </Typography>
              </StackRowJustEnd>

              {/* Các nút thao tác */}
              <StackRowJustEnd sx={{ mt: 2, gap: 2 }}>
                {order.status === 'pending' && order.payment_status === 'failed' && (
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<RateReviewOutlinedIcon />}
                    onClick={(e) => {
                      e.stopPropagation();
                      rePayment(order);
                    }}
                  >
                    Thanh toán lại
                  </Button>
                )}
                {(order.status === 'shipped' || order.status === 'completed') && (
                  <>
                    {order.payment_status === 'paid' && (
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<Cached />}
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenModal(true);
                          setRefundReason(order);
                        }}
                      >
                        Hoàn tiền
                      </Button>
                    )}
                    <Button
                      variant="outlined"
                      color="success"
                      startIcon={<CheckCircleOutlineIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleConfirmClick(order);
                      }}
                    >
                      Đã nhận hàng
                    </Button>
                  </>
                )}
                {/* // order.status === 'cancelled' ? (
                //   <Button
                //     variant="outlined"
                //     color="primary"
                //     startIcon={<ShoppingCartOutlinedIcon />}
                //     onClick={(e) => {
                //       e.stopPropagation();
                //       snackbar('info', `Mua lại đơn hàng #${order.code}`);
                //       // TODO: Gọi API mua lại
                //     }}
                //   >
                //     Mua lại
                //   </Button> */}
                {order.status === 'pending' && (
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<CancelOutlinedIcon />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCancelClick(order);
                    }}
                  >
                    Hủy đơn
                  </Button>
                )}
                {order.status === 'completed' && (
                  <>
                    {order.order_items[0]?.review === null && (
                      <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<RateReviewOutlinedIcon />}
                        onClick={(e) => {
                          e.stopPropagation();
                          setReviewOrder(order);
                          setOpenReview(true);
                        }}
                      >
                        Đánh giá
                      </Button>
                    )}
                    {/* <Button
                      variant="contained"
                      color="primary"
                      startIcon={<ShoppingCartOutlinedIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        snackbar('info', `Mua lại đơn hàng #${order.code}`);
                        // TODO: Gọi API mua lại
                      }}
                    >
                      Mua lại
                    </Button> */}
                  </>
                )}
                {/* {(order.status === 'refunded' || order.status === 'refund_requested') && (
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<CancelOutlinedIcon />}
                    onClick={(e) => {
                      e.stopPropagation();
                      // handleCancelClick(order);
                    }}
                  >
                    Chi tiết hoàn tiền
                  </Button>
                )} */}
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<ChatOutlinedIcon />}
                  onClick={(e) => {
                    e.stopPropagation();
                    window.dispatchEvent(
                      new CustomEvent('open-chat', {
                        detail: { sellerId: (order as any).seller_id, orderId: order.id },
                      }),
                    );
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

      {/* Order detail drawer */}
      <Drawer anchor="right" open={openDetail} onClose={closeOrderDetail}>
        <Box sx={{ width: 480, p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Header */}
          <StackRowJustBetween sx={{ mb: 2 }}>
            <Typography variant="h6" fontWeight={700}>
              Chi tiết đơn hàng
            </Typography>
            <IconButton onClick={closeOrderDetail} size="small" sx={{ color: 'text.secondary' }}>
              <CloseIcon />
            </IconButton>
          </StackRowJustBetween>

          {!detailOrder ? (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <Typography color="text.secondary">Không có dữ liệu</Typography>
            </Box>
          ) : (
            <Box sx={{ overflowY: 'auto', pr: 1, '&::-webkit-scrollbar': { width: 6 }, '&::-webkit-scrollbar-track': { bgcolor: 'transparent' }, '&::-webkit-scrollbar-thumb': { bgcolor: 'divider', borderRadius: 1 } }}>
              {/* Order Code & Status */}
              <Box sx={{ mb: 2, p: 1.5, bgcolor: 'background.default', borderRadius: 1.5 }}>
                <Typography fontWeight={700} sx={{ mb: 1, fontSize: '1.1rem' }}>
                  #{detailOrder.code}
                </Typography>
                <StackRow sx={{ gap: 1, flexWrap: 'wrap' }}>
                  <TagElement
                    type={paymentStatusColorMap[detailOrder.payment_status] || 'default'}
                    content={paymentStatusLabelMap[detailOrder.payment_status] || detailOrder.payment_status}
                  />
                  <TagElement
                    type={statusColorMap[detailOrder.status] || 'default'}
                    content={statusLabelMap[detailOrder.status] || detailOrder.status}
                  />
                </StackRow>
              </Box>

              {/* Refund Info - Hiển thị nếu có tiền hoàn */}
              {detailOrder.refund_amount && Number(detailOrder.refund_amount) > 0 && (
                <Box sx={{ mb: 2, p: 1.5, bgcolor: 'error.50', borderRadius: 1.5, border: '1px solid', borderColor: 'error.200' }}>
                  <Typography fontWeight={700} sx={{ mb: 1, color: 'error.main', fontSize: '1rem' }}>
                    💰 Số tiền đã được hoàn
                  </Typography>
                  <Stack spacing={0.75}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">
                        Số tiền hoàn:
                      </Typography>
                      <Typography fontWeight={700} sx={{ color: 'error.main', fontSize: '1rem' }}>
                        {FormatPrice(detailOrder.refund_amount)}
                      </Typography>
                    </Box>
                    {detailOrder.reason_refund && (
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                          Lý do hoàn tiền:
                        </Typography>
                        <Typography variant="body2" sx={{ p: 0.75, bgcolor: 'background.paper', borderRadius: 0.75 }}>
                          {detailOrder.reason_refund}
                        </Typography>
                      </Box>
                    )}
                    {detailOrder.refund_transaction_code && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption" color="text.secondary">
                          Mã giao dịch hoàn tiền:
                        </Typography>
                        <Typography variant="caption" fontWeight={600}>
                          {detailOrder.refund_transaction_code}
                        </Typography>
                      </Box>
                    )}
                    {detailOrder.img_refund && detailOrder.img_refund.length > 0 && (
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.75 }}>
                          Hình ảnh minh chứng:
                        </Typography>
                        <Stack direction="row" spacing={0.75} sx={{ flexWrap: 'wrap' }}>
                          {detailOrder.img_refund.map((img, idx) => (
                            <Box
                              key={idx}
                              component="img"
                              src={img}
                              alt={`refund-img-${idx}`}
                              sx={{
                                width: 60,
                                height: 60,
                                objectFit: 'cover',
                                borderRadius: 0.75,
                                border: '1px solid',
                                borderColor: 'divider',
                                cursor: 'pointer',
                                '&:hover': { opacity: 0.8 },
                              }}
                            />
                          ))}
                        </Stack>
                      </Box>
                    )}
                  </Stack>
                </Box>
              )}

              {/* Products Section */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5, color: 'text.primary' }}>
                  Sản phẩm ({(Array.isArray(detailOrder.order_items) ? detailOrder.order_items : (detailOrder as any).items || []).length})
                </Typography>
                <Stack spacing={1.5}>
                  {(Array.isArray(detailOrder.order_items)
                    ? detailOrder.order_items
                    : (detailOrder as any).items || []
                  ).map((it: any) => {
                    const name = it.product?.product_translations?.[0]?.name || it.name;
                    const qty = it.quantity ?? it.qty ?? 1;
                    const price = it.product?.price ?? it.price ?? 0;
                    return (
                      <Box
                        key={it.id || name}
                        sx={{
                          p: 1.25,
                          bgcolor: 'background.default',
                          borderRadius: 1,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                        }}
                      >
                        <Box sx={{ flex: 1 }}>
                          <Typography fontWeight={600} sx={{ mb: 0.5, fontSize: '0.95rem' }}>
                            {name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Số lượng: <strong>{qty}</strong>
                          </Typography>
                        </Box>
                        <Box textAlign="right">
                          <Typography fontWeight={600} sx={{ mb: 0.25 }}>
                            {FormatPrice(price)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {FormatPrice(price * qty)}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })}
                </Stack>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Shipping Fee */}
              {detailOrder.ship_fee && Number(detailOrder.ship_fee) > 0 ? (
                <Box sx={{ mb: 2, p: 1.5, bgcolor: 'info.50', borderRadius: 1.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      Phí giao hàng
                    </Typography>
                    <Typography fontWeight={600}>{FormatPrice(detailOrder.ship_fee)}</Typography>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ mb: 2, p: 1.5, bgcolor: 'success.50', borderRadius: 1.5, border: '1px solid', borderColor: 'success.200' }}>
                  <Typography variant="body2" fontWeight={600} sx={{ color: 'success.main', textAlign: 'center' }}>
                    Thanh toán khi nhận hàng (COD)
                  </Typography>
                </Box>
              )}

              {/* Order Total */}
              <Box sx={{ mb: 2, p: 1.5, bgcolor: 'primary.50', borderRadius: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography color="text.secondary" fontWeight={600}>
                    Tổng cộng
                  </Typography>
                  <Typography fontWeight={700} sx={{ fontSize: '1.15rem', color: 'primary.main' }}>
                    {FormatPrice(detailOrder.grand_total)}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Shipping Info */}
              <Box>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5, color: 'text.primary' }}>
                  Thông tin giao hàng
                </Typography>
                <Stack spacing={0.75} sx={{ p: 1.5, bgcolor: 'background.default', borderRadius: 1.5 }}>
                  <Box>
                    <Typography fontWeight={600} sx={{ mb: 0.25 }}>
                      {detailOrder.shipping_address?.name || '—'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                      {detailOrder.shipping_address?.street || '—'}
                      {detailOrder.shipping_address?.ward && `, ${detailOrder.shipping_address.ward}`}
                      {detailOrder.shipping_address?.province && `, ${detailOrder.shipping_address.province}`}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" fontWeight={600}>
                      {detailOrder.shipping_address?.phone || '—'}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Box>
          )}
        </Box>
      </Drawer>
      {/* ---- */}

      <ModalConfirm
        open={openConfirmCancel}
        title="Xác nhận hủy đơn hàng"
        message={`Bạn có chắc muốn hủy đơn hàng "${selectedOrder?.code}" không?`}
        onClose={() => {
          setOpenConfirmCancel(false);
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
      <ModalElement
        open={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
        title="Lý do hoàn tiền"
        message={
          <Stack spacing={2} sx={{ width: '100%', pt: 1 }}>
            <TextField
              label="Lý do hoàn tiền"
              fullWidth
              value={refundComment}
              onChange={(e) => setRefundComment(e.target.value)}
              multiline
              minRows={3}
            />

            {/* Image picker */}
            <input
              ref={refundInputRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              onChange={(e) => {
                handleRefundFiles(e.target.files);
                if (e.target) e.target.value = '';
              }}
            />
            <Stack direction="row" spacing={1} alignItems="center">
              <Button variant="outlined" onClick={handlePickRefund} disabled={refundImages.length >= MAX_REFUND_IMAGES}>
                Chọn ảnh ({refundImages.length}/{MAX_REFUND_IMAGES})
              </Button>
              <Typography variant="caption" color="text.secondary">
                Tối đa {MAX_REFUND_IMAGES} ảnh.
              </Typography>
            </Stack>
            <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              <span style={{ color: 'red' }}>*</span>Chỉ được hoàn tiền với số lượng sản phẩm nhất định.
            </Typography>
            {refundPreviews.length > 0 && (
              <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
                {refundPreviews.map((src, i) => (
                  <Box key={src} sx={{ position: 'relative' }}>
                    <Box
                      component="img"
                      src={src}
                      alt={`refund-preview-${i}`}
                      sx={{
                        width: 64,
                        height: 64,
                        objectFit: 'cover',
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveRefundImage(i)}
                      sx={{
                        position: 'absolute',
                        top: -6,
                        right: -6,
                        bgcolor: 'background.paper',
                        boxShadow: 1,
                        '&:hover': { bgcolor: 'background.paper' },
                      }}
                    >
                      <DeleteOutline fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Stack>
            )}

            {/* Product info from the order */}
            <Box>
              <Typography variant="subtitle2">Thông tin sản phẩm</Typography>
              {(refundReason?.order_items || []).map((it: any) => (
                <Stack key={it.id} direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
                  <StackRow gap={1}>
                    <img
                      src={it.product?.product_images?.[0]?.image_url || ''}
                      alt={it.product?.product_translations?.[0]?.name || it.name}
                      style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }}
                    />
                    <Typography>{it.product?.product_translations?.[0]?.name || it.name}</Typography>
                  </StackRow>
                  <Typography variant="caption" color="text.secondary">
                    SL: {it.quantity ?? it.qty ?? 1}
                  </Typography>
                </Stack>
              ))}
            </Box>
          </Stack>
        }
        maxWidth="sm"
        confirmText="Đồng ý"
        onConfirm={handleConfirmRefund}
        cancelText="Đóng"
      />
    </ContainerWrapper>
  );
};

export default PurchasePage;
