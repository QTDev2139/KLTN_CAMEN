import { ReactNode } from 'react';
import Header from './header.layout';
import Footer from './footer.layout';
import React from 'react';
import ContainerWrapper from '~/components/elements/container/container.element';
import { Stack, useTheme } from '@mui/material';
import { PADDING_GAP_LAYOUT } from '~/common/constant/style.constant';

interface SiteLayoutProps {
  children: ReactNode;
}

export default function SiteLayout({ children }: SiteLayoutProps) {
  const { palette } = useTheme();
  return (
    <Stack sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Stack
        sx={{
          flex: 1,
          backgroundColor: palette.background.paper,
        }}
      >
        <ContainerWrapper
          sx={{
            padding: PADDING_GAP_LAYOUT,
            backgroundColor: palette.background.default,
          }}
        >
          {children}
        </ContainerWrapper>
      </Stack>
      <Footer />
    </Stack>
  );
}
