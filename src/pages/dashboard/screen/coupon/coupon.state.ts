import { Coupon } from "~/apis/coupon/coupon.interface.api";
import { formatDateTime, todayDateTime } from "~/common/until/date-format.until";
import { TagType } from "~/components/elements/tag/tag.element";

export const StateTagType: Record<string, TagType> = {
  pending: 'warning', 
  approved: 'success', 
  rejected: 'error', 
};

export const StateLabel: Record<string, string> = {
  pending: 'Chờ duyệt',
  approved: 'Đã duyệt',
  rejected: 'Từ chối',
};

export const getValidityStatus = (coupon: Coupon) => {
  if (coupon.state === 'pending' || coupon.state === 'rejected') return { label: null, type: undefined };

  const now = todayDateTime;
  const start = formatDateTime(coupon.start_date);
  const end = formatDateTime(coupon.end_date);

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