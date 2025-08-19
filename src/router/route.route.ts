import { ElementType } from 'react';
import { RouteType } from './route.enum';
import { PATH } from '.';
import ErrorPage from '~/pages/Error';
import DashboardPage from '~/pages/Dashboard';
import IndustryScreen from '~/pages/Dashboard/Industry';

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

  // PROTECTED
  {
    path: PATH.PAGE.DASHBOARD,
    element: DashboardPage,
    // layout: DashboardLayout,
    type: RouteType.PROTECTED,
    // allowUserTypes: [UserType.ROOT, UserType.ADMIN, UserType.HR],
    children: [
      {
        path: PATH.DASHBOARD_SCREEN.INDUSTRY,
        element: IndustryScreen,
        type: RouteType.PROTECTED,
        // allowUserTypes: [UserType.ROOT, UserType.ADMIN, UserType.HR],
      },
    ],
  },
];
