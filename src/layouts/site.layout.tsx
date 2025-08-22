import { Stack } from '@mui/material';
import { ReactNode } from 'react';

export interface SiteLayoutProps {
  children: ReactNode;
}

export default function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <>
      <header>Header</header>
      <Stack>{children}</Stack>
      <footer>Footer</footer>
    </>
  );
}
