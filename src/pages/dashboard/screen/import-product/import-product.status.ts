import { TagType } from "~/components/elements/tag/tag.element";

export const StatusLabelImport: Record<string, TagType> = {
  pending: 'error',
  processing: 'warning',
  shipped: 'info',
  supplemented: 'info',
  partially: 'warning',
  completed: 'success',
  cancelled: 'primary',
};
export const NameLabelImport: Record<string, string> = {
  pending: 'đang chờ',
  processing: 'đang lấy hàng',
  shipped: 'đã giao',
  supplemented: 'đã bổ sung hàng',
  partially: 'thiếu hàng',
  completed: 'hoàn thành',
  cancelled: 'đã hủy',
};

