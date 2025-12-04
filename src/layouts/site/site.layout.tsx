import { ReactNode } from 'react';
import Header from './header.layout';
import Footer from './footer.layout';
import ContainerWrapper from '~/components/elements/container/container.element';
import { Stack, useTheme } from '@mui/material';
import { PADDING_GAP_LAYOUT } from '~/common/constant/style.constant';
import ChatBox from '~/components/chat/chatbox';

interface SiteLayoutProps {
  children: ReactNode;
}

export default function SiteLayout({ children }: SiteLayoutProps) {
  const { palette } = useTheme();
  return (
    <Stack sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ChatBox />
      <Header />
      <Stack
        sx={{
          flex: 1,
          backgroundColor: palette.background.default,
        }}
      >
        <Stack
          sx={{
            backgroundColor: palette.background.default,
            minHeight: 'calc(100vh - 160px)',
          }}
        >
          {children}
        </Stack>
      </Stack>
      <Footer />
      
    </Stack>
  );
}
