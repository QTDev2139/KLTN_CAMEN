import { TagType } from "~/components/elements/tag/tag.element";

// Order View
export const statusColorMap: Record<string, TagType> = {
  pending: 'warning',
  processing: 'primary',
  shipped: 'info',
  completed: 'success',
  cancelled: 'error',
};

export const statusLabelMap: Record<string, string> = {
  pending: 'Chờ xử lý',
  processing: 'Đang xử lý',
  shipped: 'Đang giao',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
};

export const paymentStatusColorMap: Record<string, TagType> = {
  unpaid: 'warning',
  paid: 'success',
  refunded: 'info',
};

export const paymentStatusLabelMap: Record<string, string> = {
  unpaid: 'Chưa thanh toán',
  paid: 'Đã thanh toán',
  refunded: 'Đã hoàn tiền',
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
];

export const PaymentStatusTagType: Record<string, TagType> = {
  unpaid: 'warning',
  paid: 'success',
  refunded: 'info',
};

export const PaymentStatusLabel: Record<string, string> = {
  unpaid: 'Chưa thanh toán',
  paid: 'Đã thanh toán',
  refunded: 'Đã hoàn tiền',
};

export const PaymentMethodLabel: Record<string, string> = {
  cod: 'COD',
  vnpay: 'VNPay',
};
