import { TagType } from "~/components/elements/tag/tag.element";

// Order View
export const statusColorMap: Record<string, TagType> = {
  pending: 'warning',
  processing: 'primary',
  shipped: 'info',
  completed: 'success',
  cancelled: 'error',
  refund_requested: 'warning',
  refunded: 'info',
  partially_refunded: 'info',
  refund_rejected: 'error',
};

export const statusLabelMap: Record<string, string> = {
  pending: 'Chờ xác nhận',
  processing: 'Đang chuẩn bị hàng',
  shipped: 'Đang giao',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
  refund_requested: 'Yêu cầu hoàn tiền',
  refunded: 'Đã hoàn tiền',
  partially_refunded: 'Đã hoàn tiền',
  refund_rejected: 'Từ chối hoàn tiền',
};

export const paymentStatusColorMap: Record<string, TagType> = {
  unpaid: 'warning',
  paid: 'success',
  refunded: 'info',
};

export const paymentStatusLabelMap: Record<string, string> = {
  unpaid: 'Thanh toán khi nhận hàng',
  paid: 'Đã thanh toán',
  refunded: 'Đã hoàn tiền',
  failed: 'Thanh toán thất bại',
};

export const paymentMethodMap: Record<string, string> = {
  cod: 'Thanh toán khi nhận hàng (COD)',
  vnpay: 'VNPay',
};

// Order list
export const ORDER_FILTERS = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Chờ xác nhận', value: 'pending' },
  { label: 'Chờ lấy hàng', value: 'processing' },
  { label: 'Đang giao', value: 'shipped' },
  { label: 'Đã giao', value: 'completed' },
  { label: 'Đã hủy', value: 'cancelled' },
  { label: 'Hoàn tiền', value: 'refunded' },
];

export const PaymentStatusTagType: Record<string, TagType> = {
  unpaid: 'warning',
  paid: 'success',
  refunded: 'success',
  failed: 'error',
  partially_refunded: 'success',
};

export const PaymentStatusLabel: Record<string, string> = {
  unpaid: 'Thanh toán khi nhận hàng',
  paid: 'Đã thanh toán',
  refunded: 'Đã hoàn tiền',
  failed: 'Thanh toán thất bại',
  partially_refunded: 'Đã hoàn tiền',
};

export const PaymentMethodLabel: Record<string, string> = {
  cod: 'COD',
  vnpay: 'VNPay',
};
