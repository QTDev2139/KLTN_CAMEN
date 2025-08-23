import { ReactNode } from 'react';
import Header from './header.layout';
import Footer from './footer.layout';
import React from 'react';

export interface SiteLayoutProps {
  children: ReactNode;
}

export default function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <React.Fragment>
      <Header/>
      {children}
      <Footer/>
    </React.Fragment>
  );
}
