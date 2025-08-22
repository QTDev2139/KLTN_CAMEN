import { Children, ElementType } from 'react';
import { RouteType } from './route.enum';
import { PATH } from '.';
import ErrorPage from '~/pages/error';
import Not_FoundPage from '~/pages/not_found';

import SitePage from '~/pages/site/site.page';
import HomePage from '~/pages/site/home/home.screen';
import CartPage from '~/pages/site/cart/cart.screen';
import CategoryPage from '~/pages/site/category/category.screen';
import ProductPage from '~/pages/site/product/product.screen';
import SupportPage from '~/pages/site/support';
import BlogPage from '~/pages/site/blog/blog.screen';
import AccountPage from '~/pages/site/account/account.screen';
import CheckoutPage from '~/pages/site/checkout/checkout.screen';

import DashboardPage from '~/pages/dashboard/dashboard.page';
import OverviewScreen from '~/pages/dashboard/overview/overview.screen';
import SiteLayout from '~/layouts/site.layout';

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
        path: PATH.SITE_SCREEN.PRODUCT,
        element: ProductPage,
        type: RouteType.PUBLIC,
      },
      {
        path: PATH.SITE_SCREEN.CART,
        element: CartPage,
        type: RouteType.PUBLIC,
      },
      {
        path: PATH.SITE_SCREEN.SUPPORT,
        element: SupportPage,
        type: RouteType.PUBLIC,
      },
      {
        path: PATH.SITE_SCREEN.BLOG,
        element: BlogPage,
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
