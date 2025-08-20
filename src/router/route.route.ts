import { Children, ElementType } from 'react';
import { RouteType } from './route.enum';
import { PATH } from '.';
import ErrorPage from '~/pages/error';
import Not_FoundPage from '~/pages/not_found';

import HomePage from '~/pages/home';
import CartPage from '~/pages/home/cart';
import CategoryPage from '~/pages/home/category';
import ProductPage from '~/pages/home/product';
import SupportPage from '~/pages/home/support';
import BlogPage from '~/pages/home/blog';
import AccountPage from '~/pages/home/account';
import CheckoutPage from '~/pages/home/checkout';

import DashboardPage from '~/pages/dashboard';
import OverviewScreen from '~/pages/dashboard/overview';

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

  // HOME
  {
    path: PATH.PAGE.HOME,
    element: HomePage,
    type: RouteType.PROTECTED,
    children: [
      {
        path: PATH.HOME_SCREEN.CATEGORY,
        element: CategoryPage,
        type: RouteType.PUBLIC,
      },
      {
        path: PATH.HOME_SCREEN.PRODUCT,
        element: ProductPage,
        type: RouteType.PUBLIC,
      },
      {
        path: PATH.HOME_SCREEN.CART,
        element: CartPage,
        type: RouteType.PUBLIC,
      },
      {
        path: PATH.HOME_SCREEN.SUPPORT,
        element: SupportPage,
        type: RouteType.PUBLIC,
      },
      {
        path: PATH.HOME_SCREEN.BLOG,
        element: BlogPage,
        type: RouteType.PUBLIC,
      },
      {
        path: PATH.HOME_SCREEN.ACCOUNT,
        element: AccountPage,
        type: RouteType.PUBLIC,
      },
      {
        path: PATH.HOME_SCREEN.CHECKOUT,
        element: CheckoutPage,
        type: RouteType.PUBLIC,
      },
    ],
  },

  // PROTECTED
  {
    path: PATH.PAGE.DASHBOARD,
    element: DashboardPage,
    // layout: DashboardLayout,
    type: RouteType.PROTECTED,
    // allowUserTypes: [UserType.ROOT, UserType.ADMIN, UserType.HR],
    children: [
      {
        path: PATH.DASHBOARD_SCREEN.OVERVIEW,
        element: OverviewScreen,
        type: RouteType.PROTECTED,
      },
    ],
  },
];
