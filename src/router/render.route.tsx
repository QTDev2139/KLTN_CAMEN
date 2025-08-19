import { Navigate, Route } from 'react-router-dom';
import { Route as RouteInterface } from './route.route';
import React from 'react';
import { PATH } from '.';

export const renderRoutes = (routes: RouteInterface[]) =>
  routes.map((route) => {
    const { path, layout, element, type, children } = route;
    const Layout = layout || React.Fragment;
    let Element = element;

    // // Logic bảo vệ
    // if (type === RouteType.PROTECTED) {
    //   if (!account.isLogin) {
    //     Element = () => <Navigate to={PATH.PAGE.AUTH} />;
    //   } else if (allowUserTypes.length && !allowUserTypes.includes(account.user!.type)) {
    //     Element = () => <Navigate to={PATH.PAGE.ERROR} />;
    //   }
    // }

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
        {/* {children && renderRoutes(children)}

        {path === PATH.PAGE.DASHBOARD && (
            <Route index element={<Navigate to={PATH.PAGE.DASHBOARD + PATH.DASHBOARD_SCREEN.INDUSTRY} />}/>
        )} */}
      </Route>
    );
  });
