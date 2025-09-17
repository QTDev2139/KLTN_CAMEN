import { Navigate, Route } from 'react-router-dom';
import { Route as RouteInterface } from './route.route';
import React from 'react';
import { PATH } from '.';
import { RouteType } from './route.enum';
import { RoleGuardRoute } from './guards';
import { UserType } from '~/apis/user/user.enum';

const withGuard = (
  type: RouteType,
  path: string,
  node: React.ReactNode
): React.ReactNode => {
  // dashboard không cho khách hàng vào
  if (path === PATH.PAGE.DASHBOARD) {
    return <RoleGuardRoute allow={[UserType.ADMIN, UserType.MARKETING, UserType.STAFF]}>{node}</RoleGuardRoute>;
  }

  return node;
};

export const renderRoutes = (routes: RouteInterface[]) =>
  routes.map((route) => {
    const { path, layout, element, type, children } = route;
    const Layout = layout || React.Fragment;
    const Element = element;

    const guardedElement = withGuard(type, path,
      <Layout>
        <Element />
      </Layout>
    );

    return (
      <Route key={path} path={path} element={guardedElement}>
        {children && renderRoutes(children)}

        {/* điều hướng index cho dashboard */}
        {path === PATH.PAGE.DASHBOARD && (
          <Route index element={<Navigate to={PATH.DASHBOARD_SCREEN.OVERVIEW} />} />
        )}

        {/* điều hướng index cho site */}
        {path === PATH.PAGE.SITE && (
          <Route index element={<Navigate to={PATH.SITE_SCREEN.HOME} />} />
        )}
      </Route>
    );
  });
