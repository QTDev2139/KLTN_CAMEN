import { ReactNode } from 'react';
import Header from './header.layout';
import Footer from './footer.layout';
import React from 'react';
import ContainerWrapper from '~/components/elements/container/container.element';

export interface SiteLayoutProps {
  children: ReactNode;
}

export default function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <React.Fragment>
      <Header />
      <ContainerWrapper sx={{ padding: '20px 0' }}>{children}</ContainerWrapper>
      <Footer />
    </React.Fragment>
  );
}
