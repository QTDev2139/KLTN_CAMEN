import { Navigate, Route } from 'react-router-dom';
import { Route as RouteInterface } from './route.route';
import React from 'react';
import { PATH } from '.';

export const renderRoutes = (routes: RouteInterface[]) =>
  routes.map((route) => {
    const { path, layout, element, type, children } = route;
    const Layout = layout || React.Fragment;
    let Element = element;

    return (
        <Route
          key={path}
          path={path}
          element={
            <Layout>
              <Element />
            </Layout>
          }
        >
          {children && renderRoutes(children)}
          {path === PATH.PAGE.DASHBOARD && (
              <Route index element={<Navigate to={PATH.PAGE.DASHBOARD} />}/> // Mặc định render khi vào trang
          )}
          {(path === PATH.SITE_SCREEN.HOME ) && (
              <Route index element={<Navigate to={PATH.SITE_SCREEN.HOME} />}/> // Mặc định render khi vào trang
          )}
        </Route>
    );
  });
