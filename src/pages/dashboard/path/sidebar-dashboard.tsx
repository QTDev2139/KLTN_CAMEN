import { PATH } from "~/router";
import { UserType } from "~/apis/user/user.enum";

export interface SidebarItem {
  to: string;
  title: string;
  allowUserTypes?: UserType[]; // optional: nếu không khai báo thì coi như ai cũng thấy
}

export const sidebarsDashboard: SidebarItem[] = [
  {
    to: PATH.DASHBOARD_SCREEN.OVERVIEW,
    title: 'Overview',
    allowUserTypes: [UserType.ROOT, UserType.ADMIN, UserType.MANAGER, UserType.EXECUTIVE],
  },
  {
    to: PATH.DASHBOARD_SCREEN.ORDERS,
    title: 'Quản lý đơn hàng',
    allowUserTypes: [UserType.ROOT, UserType.ADMIN, UserType.MANAGER, UserType.MARKETING, UserType.STAFF],
  },
  {
    to: PATH.DASHBOARD_SCREEN.PRODUCT,
    title: 'Quản lý sản phẩm',
    allowUserTypes: [UserType.ROOT, UserType.ADMIN, UserType.MANAGER, UserType.MARKETING, UserType.STAFF],
  },
  {
    to: PATH.DASHBOARD_SCREEN.CUSTOMERS,
    title: 'Quản lý nhân viên',
    allowUserTypes: [UserType.ROOT, UserType.ADMIN, UserType.MANAGER, UserType.EXECUTIVE],
  },
  {
    to: PATH.DASHBOARD_SCREEN.BLOG,
    title: 'Quản lý bài viết',
    allowUserTypes: [UserType.ROOT, UserType.ADMIN, UserType.MANAGER, UserType.EXECUTIVE], // STAFF không có quyền
  },
  {
    to: PATH.DASHBOARD_SCREEN.COUPON,
    title: 'Quản lý mã giảm giá',
    allowUserTypes: [UserType.ROOT, UserType.ADMIN, UserType.MANAGER, UserType.EXECUTIVE],
  },
  {
    to: PATH.DASHBOARD_SCREEN.REVIEWS,
    title: 'Quản lý đánh giá',
    allowUserTypes: [UserType.ROOT, UserType.ADMIN, UserType.MANAGER, UserType.EXECUTIVE],
  },
];