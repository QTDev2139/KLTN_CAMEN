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
import { ContactMailOutlined, BadgeOutlined, GroupOutlined } from '@mui/icons-material';
import CategoryOutlined from '@mui/icons-material/CategoryOutlined';

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
    allowUserTypes: [
      UserType.ROOT,
      UserType.ADMIN,
      UserType.MANAGER,
      UserType.EXECUTIVE,
      UserType.MARKETING,
      UserType.STAFF,
      UserType.STORAGEKEEPER,
    ],
  },
  {
    to: PATH.DASHBOARD_SCREEN.ORDERS,
    title: 'Đơn hàng',
    icon: <ShoppingCartOutlined fontSize="small" />,
    allowUserTypes: [UserType.ADMIN, UserType.MARKETING, UserType.STAFF],
  },
  {
    to: PATH.DASHBOARD_SCREEN.PRODUCT,
    title: 'Sản phẩm',
    icon: <Inventory2Outlined fontSize="small" />,
    allowUserTypes: [UserType.ADMIN, UserType.MANAGER, UserType.STAFF],
  },
  {
    to: PATH.DASHBOARD_SCREEN.CUSTOMERS.EMPLOYEES,
    title: 'Người dùng',
    icon: <GroupOutlined fontSize="small" />,
    allowUserTypes: [UserType.ROOT, UserType.ADMIN],
    children: [
      {
        to: PATH.DASHBOARD_SCREEN.CUSTOMERS.EMPLOYEES,
        title: 'Nhân viên',
        icon: <BadgeOutlined fontSize="small" />,
        allowUserTypes: [UserType.ROOT, UserType.ADMIN],
      },
      {
        to: PATH.DASHBOARD_SCREEN.CUSTOMERS.CUSTOMERS,
        title: 'Khách hàng',
        icon: <PeopleOutline fontSize="small" />,
        allowUserTypes: [UserType.ADMIN, UserType.MANAGER],
      },
    ],
  },
  {
    to: PATH.DASHBOARD_SCREEN.BLOG.BLOG_VIEW,
    title: 'Bài viết',
    icon: <ArticleOutlined fontSize="small" />,
    allowUserTypes: [UserType.ADMIN, UserType.MANAGER], // STAFF không có quyền
    children: [
      {
        to: PATH.DASHBOARD_SCREEN.BLOG.BLOG_VIEW,
        title: 'Danh sách bài viết',
        icon: <ArticleOutlined fontSize="small" />,
        allowUserTypes: [UserType.ADMIN, UserType.MANAGER],
      },
      {
        to: PATH.DASHBOARD_SCREEN.BLOG.BLOG_CATEGORY,
        title: 'Danh mục bài viết',
        icon: <CategoryOutlined fontSize="small" />,
        allowUserTypes: [UserType.ADMIN, UserType.MANAGER],
      },
    ],
  },
  {
    to: PATH.DASHBOARD_SCREEN.COUPON,
    title: 'Mã giảm giá',
    icon: <LocalOfferOutlined fontSize="small" />,
    allowUserTypes: [UserType.ROOT, UserType.ADMIN, UserType.MANAGER, UserType.STAFF],
  },
  {
    to: PATH.DASHBOARD_SCREEN.REVIEWS,
    title: 'Đánh giá',
    icon: <StarOutline fontSize="small" />,
    allowUserTypes: [UserType.ADMIN, UserType.MANAGER, UserType.STAFF],
  },
  {
    to: PATH.DASHBOARD_SCREEN.CHATBOX,
    title: 'Tin nhắn',
    icon: <ChatBubbleOutline fontSize="small" />,
    allowUserTypes: [UserType.MANAGER, UserType.ADMIN, UserType.STAFF],
  },
  {
    to: PATH.DASHBOARD_SCREEN.CONTACT,
    title: 'Liên hệ',
    icon: <ContactMailOutlined fontSize="small" />,
    allowUserTypes: [UserType.ROOT, UserType.ADMIN, UserType.MANAGER],
  },
  {
    to: PATH.DASHBOARD_SCREEN.IMPORT_PRODUCT,
    title: 'Nhập hàng',
    icon: <Inventory2Outlined fontSize="small" />,
    allowUserTypes: [UserType.ADMIN, UserType.MANAGER, UserType.STAFF, UserType.STORAGEKEEPER],
  },
];
