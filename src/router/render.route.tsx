import { Navigate, Route } from 'react-router-dom';
import { Route as RouteInterface } from './route.route';
import React from 'react';
import { PATH } from '.';
import { RouteType } from './route.enum';
import { RoleGuardRoute } from './role-guards';
import { UserType } from '~/apis/user/user.enum';
import LangGuard from './lang-guard';

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

    if (path === PATH.PAGE.SITE ) {
      return (
        <Route key="lang-guard" path=":lang" element={<LangGuard />}>
          <Route path="" element={guardedElement}>
            {children && renderRoutes(children)}

            <Route index element={<Navigate to={PATH.SITE_SCREEN.HOME} replace />} />
          </Route>
        </Route>
      );
    }

    if (path === PATH.PAGE.AUTH) {
      return (
        <Route key="lang-guard-auth" path=":lang" element={<LangGuard />}>
          <Route path="auth" element={guardedElement}>
            {children && renderRoutes(children)}
            <Route index element={<Navigate to={PATH.AUTH_SCREEN.LOGIN} replace />} />
          </Route>
        </Route>
      );
    }
    

    return (
      <Route key={path} path={path} element={guardedElement}>
        {children && renderRoutes(children)}

        {path === PATH.PAGE.DASHBOARD && (
          <Route index element={<Navigate to={PATH.DASHBOARD_SCREEN.OVERVIEW} replace />} />
        )}
      </Route>
    );
  });
