import { Coupon } from "~/apis/coupon/coupon.interface.api";
import { TagType } from "~/components/elements/tag/tag.element";

export const StateTagType: Record<string, TagType> = {
  pending: 'warning', // Chờ duyệt - màu vàng
  approved: 'success', // Đã duyệt - màu xanh lá
  rejected: 'error', // Từ chối - màu đỏ
};

export const StateLabel: Record<string, string> = {
  pending: 'Chờ duyệt',
  approved: 'Đã duyệt',
  rejected: 'Từ chối',
};

export const getValidityStatus = (coupon: Coupon) => {
  if (coupon.state === 'pending' || coupon.state === 'rejected') return { label: null, type: undefined };

  const now = new Date();
  const start = coupon.start_date ? new Date(coupon.start_date) : null;
  const end = coupon.end_date ? new Date(coupon.end_date) : null;

  if (start && now < start) {
    return { label: 'Sắp diễn ra', type: 'info' as TagType };
  }

  if (start && end && now >= start && now <= end) {
    return { label: 'Đang diễn ra', type: 'success' as TagType };
  }

  if (end && now > end) {
    return { label: 'Đã hết hạn', type: 'error' as TagType };
  }

  return { label: null, type: undefined };
};