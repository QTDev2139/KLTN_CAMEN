import { PATH } from '~/router';
import { UserType } from '~/apis/user/user.enum';
import DashboardOutlined from '@mui/icons-material/DashboardOutlined';
import ShoppingCartOutlined from '@mui/icons-material/ShoppingCartOutlined';
import Inventory2Outlined from '@mui/icons-material/Inventory2Outlined';
import PeopleOutline from '@mui/icons-material/PeopleOutline';
import ArticleOutlined from '@mui/icons-material/ArticleOutlined';
import LocalOfferOutlined from '@mui/icons-material/LocalOfferOutlined';
import StarOutline from '@mui/icons-material/StarOutline';
import ChatBubbleOutline from '@mui/icons-material/ChatBubbleOutline';
import { ContactMailOutlined } from '@mui/icons-material';

export interface SidebarItem {
  to: string;
  icon?: React.ReactNode;
  title: string;
  allowUserTypes?: UserType[];
  children?: SidebarItem[];
}

export const sidebarsDashboard: SidebarItem[] = [
  {
    to: PATH.DASHBOARD_SCREEN.OVERVIEW,
    title: 'Overview',
    icon: <DashboardOutlined fontSize="small" />,
    allowUserTypes: [UserType.ROOT, UserType.ADMIN, UserType.MANAGER, UserType.EXECUTIVE],
  },
  {
    to: PATH.DASHBOARD_SCREEN.ORDERS,
    title: 'Quản lý đơn hàng',
    icon: <ShoppingCartOutlined fontSize="small" />,
    allowUserTypes: [UserType.ROOT, UserType.ADMIN, UserType.MANAGER, UserType.MARKETING, UserType.STAFF],
  },
  {
    to: PATH.DASHBOARD_SCREEN.PRODUCT,
    title: 'Quản lý sản phẩm',
    icon: <Inventory2Outlined fontSize="small" />,
    allowUserTypes: [UserType.ROOT, UserType.ADMIN, UserType.MANAGER, UserType.MARKETING, UserType.STAFF],
  },
  {
    to: PATH.DASHBOARD_SCREEN.CUSTOMERS,
    title: 'Quản lý nhân viên',
    icon: <PeopleOutline fontSize="small" />,
    allowUserTypes: [UserType.ROOT, UserType.ADMIN, UserType.MANAGER, UserType.EXECUTIVE],
  },
  {
    to: PATH.DASHBOARD_SCREEN.BLOG.BLOG_VIEW,
    title: 'Quản lý bài viết',
    icon: <ArticleOutlined fontSize="small" />,
    allowUserTypes: [UserType.ROOT, UserType.ADMIN, UserType.MANAGER, UserType.EXECUTIVE], // STAFF không có quyền
    children: [
      {
        to: PATH.DASHBOARD_SCREEN.BLOG.BLOG_VIEW,
        title: 'Danh sách bài viết',
        icon: <ArticleOutlined fontSize="small" />,
        allowUserTypes: [UserType.ROOT, UserType.ADMIN, UserType.MANAGER, UserType.EXECUTIVE],
      },
      {
        to: PATH.DASHBOARD_SCREEN.BLOG.BLOG_CATEGORY,
        title: 'Danh mục bài viết',
        icon: <LocalOfferOutlined fontSize="small" />,
        allowUserTypes: [UserType.ROOT, UserType.ADMIN, UserType.MANAGER, UserType.EXECUTIVE],
      },
    ],
  },
  {
    to: PATH.DASHBOARD_SCREEN.COUPON,
    title: 'Quản lý mã giảm giá',
    icon: <LocalOfferOutlined fontSize="small" />,
    allowUserTypes: [UserType.ROOT, UserType.ADMIN, UserType.MANAGER, UserType.EXECUTIVE],
  },
  {
    to: PATH.DASHBOARD_SCREEN.REVIEWS,
    title: 'Quản lý đánh giá',
    icon: <StarOutline fontSize="small" />,
    allowUserTypes: [UserType.ROOT, UserType.ADMIN, UserType.MANAGER, UserType.EXECUTIVE],
  },
  {
    to: PATH.DASHBOARD_SCREEN.CHATBOX,
    title: 'Quản lý tin nhắn',
    icon: <ChatBubbleOutline fontSize="small" />,
    allowUserTypes: [UserType.ROOT, UserType.ADMIN, UserType.STAFF],
  },
  {
    to: PATH.DASHBOARD_SCREEN.CONTACT,
    title: 'Quản lý liên hệ',
    icon: <ContactMailOutlined fontSize="small" />,
    allowUserTypes: [UserType.ROOT, UserType.ADMIN, UserType.MANAGER],
  },
];
