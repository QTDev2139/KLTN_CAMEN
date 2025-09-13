import { Container, SxProps, Theme } from '@mui/material';
import { ReactNode } from 'react';

export interface ContainerWrapperProp {
  children: ReactNode;
  sx?: SxProps<Theme>;
}

export default function ContainerWrapper({ sx, children }: ContainerWrapperProp) {
    return <Container maxWidth="lg" sx={{ ...sx }}>{children}</Container>
}
