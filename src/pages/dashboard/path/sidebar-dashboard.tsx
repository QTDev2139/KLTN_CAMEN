import { PATH } from "~/router";

export const sidebarsDashboard = [
    {
      to: PATH.DASHBOARD_SCREEN.OVERVIEW,
      title: 'Overview',
    },
    {
      to: PATH.DASHBOARD_SCREEN.ORDERS,
      title: 'Quản lý đơn hàng',
    },
    {
      to: PATH.DASHBOARD_SCREEN.PRODUCT,
      title: 'Quản lý sản phẩm',
    },
    {
      to: PATH.DASHBOARD_SCREEN.CUSTOMERS,
      title: 'Quản lý nhân viên',
    },
    {
      to: PATH.DASHBOARD_SCREEN.BLOG,
      title: 'Quản lý bài viết',
    },
    {
      to: PATH.DASHBOARD_SCREEN.COUPON,
      title: 'Quản lý mã giảm giá',
    },
    {
      to: PATH.DASHBOARD_SCREEN.REVIEWS,
      title: 'Quản lý đánh giá',
    },
  ] as const;