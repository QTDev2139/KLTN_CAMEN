import { ElementType } from 'react';
import { RouteType } from './route.enum';
import { PATH } from '.';
import ErrorPage from '~/pages/error';
import Not_FoundPage from '~/pages/not_found';

import AuthPage from '~/pages/auth/index';
import LoginPage from '~/pages/auth/sign-in/sign-in';
import SignupPage from '~/pages/auth/sign-up/sign-up';
import ForgotPasswordPage from '~/pages/auth/forgot-password/forgot-password';

import SiteLayout from '~/layouts/site/site.layout';
import SitePage from '~/pages/site/site.page';
import HomePage from '~/pages/site/screen/home/home.screen';
import CartPage from '~/pages/site/screen/cart/cart.screen';
import CategoryPage from '~/pages/site/screen/category/category.screen';
import ProductPage from '~/pages/site/screen/product/product.screen';
import ProductDomesticPage from '~/pages/site/screen/product-domestic/product-domestic.screen';
import ProductExportPage from '~/pages/site/screen/product-export/product-export.screen';
import ProductDetailPage from '~/pages/site/screen/product-detail/product-detail.screen';
import ContactPage from '~/pages/site/screen/contact/contact.screen';
import BlogPage from '~/pages/site/screen/blog/blog.screen';
import BlogDetailPage from '~/pages/site/screen/blog-detail/blog-detail.screen';
import AccountPage from '~/pages/site/screen/account/account.screen';
import CheckoutPage from '~/pages/site/screen/checkout/checkout.screen';

import DashboardLayout from '~/layouts/dashboard/dashboard.layout';
import DashboardPage from '~/pages/dashboard/dashboard.page';
import OverviewScreen from '~/pages/dashboard/screen/overview/overview.screen';
import OrdersScreen from '~/pages/dashboard/screen/orders/orders.screen';
import ProductScreen from '~/pages/dashboard/screen/product/product.screen';
import CustomersScreen from '~/pages/dashboard/screen/customers/customers.screen';
import BlogScreen from '~/pages/dashboard/screen/blog/blog.screen';
import CouponScreen from '~/pages/dashboard/screen/coupon/coupon.screen';
import ReviewsScreen from '~/pages/dashboard/screen/reviews/reviews.screen';

export type Route = {
  path: string;
  element: ElementType;
  layout?: ElementType;
  children?: Route[];
  // allowUserTypes: UserType[];  // Các loại người dùng được phép truy cập (quyền)
  type: RouteType;
};

export const routes: Route[] = [
  {
    path: PATH.PAGE.ERROR,
    element: ErrorPage,
    type: RouteType.PUBLIC,
  },
  {
    path: PATH.PAGE.NOT_FOUND,
    element: Not_FoundPage,
    type: RouteType.PUBLIC,
  },
  // Auth
  {
    path: PATH.PAGE.AUTH,
    element: AuthPage,
    type: RouteType.PUBLIC,
    children: [
      {
        path: PATH.AUTH_SCREEN.LOGIN,
        element: LoginPage,
        type: RouteType.PUBLIC,
      },
      {
        path: PATH.AUTH_SCREEN.SIGN_UP,
        element: SignupPage,
        type: RouteType.PUBLIC,
      },
      {
        path: PATH.AUTH_SCREEN.FORGOT_PW,
        element: ForgotPasswordPage,
        type: RouteType.PUBLIC,
      },
    ],
  },

  // SITE
  {
    path: PATH.PAGE.SITE,
    element: SitePage,
    layout: SiteLayout,
    type: RouteType.PROTECTED,
    children: [
      {
        path: PATH.SITE_SCREEN.HOME,
        element: HomePage,
        type: RouteType.PUBLIC,
      },
      {
        path: PATH.SITE_SCREEN.CATEGORY,
        element: CategoryPage,
        type: RouteType.PUBLIC,
      },
      {
        path: PATH.SITE_SCREEN.PRODUCT.DOMESTIC,
        element: ProductDomesticPage,
        type: RouteType.PUBLIC,
      },
      {
        path: PATH.SITE_SCREEN.PRODUCT.EXPORT,
        element: ProductExportPage,
        type: RouteType.PUBLIC,
      },
      {
        path: PATH.SITE_SCREEN.PRODUCT_DETAIL,
        element: ProductDetailPage,
        type: RouteType.PUBLIC,
      },
      {
        path: PATH.SITE_SCREEN.CART,
        element: CartPage,
        type: RouteType.PUBLIC,
      },
      {
        path: PATH.SITE_SCREEN.CONTACT,
        element: ContactPage,
        type: RouteType.PUBLIC,
      },
      {
        path: PATH.SITE_SCREEN.BLOG,
        element: BlogPage,
        type: RouteType.PUBLIC,
      },
      {
        path: PATH.SITE_SCREEN.BLOG_DETAIL,
        element: BlogDetailPage,
        type: RouteType.PUBLIC,
      },
      {
        path: PATH.SITE_SCREEN.ACCOUNT,
        element: AccountPage,
        type: RouteType.PUBLIC,
      },
      {
        path: PATH.SITE_SCREEN.CHECKOUT,
        element: CheckoutPage,
        type: RouteType.PUBLIC,
      },
    ],
  },

  // PROTECTED
  {
    path: PATH.PAGE.DASHBOARD,
    element: DashboardPage,
    layout: DashboardLayout,
    type: RouteType.PROTECTED,
    // allowUserTypes: [UserType.ROOT, UserType.ADMIN, UserType.HR],
    children: [
      {
        path: PATH.DASHBOARD_SCREEN.OVERVIEW,
        element: OverviewScreen,
        type: RouteType.PROTECTED,
      },
      {
        path: PATH.DASHBOARD_SCREEN.ORDERS,
        element: OrdersScreen,
        type: RouteType.PROTECTED,
      },
      {
        path: PATH.DASHBOARD_SCREEN.PRODUCT,
        element: ProductScreen,
        type: RouteType.PROTECTED,
      },
      {
        path: PATH.DASHBOARD_SCREEN.CUSTOMERS,
        element: CustomersScreen,
        type: RouteType.PROTECTED,
      },
      {
        path: PATH.DASHBOARD_SCREEN.BLOG,
        element: BlogScreen,
        type: RouteType.PROTECTED,
      },
      {
        path: PATH.DASHBOARD_SCREEN.COUPON,
        element: CouponScreen,
        type: RouteType.PROTECTED,
      },
      {
        path: PATH.DASHBOARD_SCREEN.REVIEWS,
        element: ReviewsScreen,
        type: RouteType.PROTECTED,
      },
    ],
  },
];
