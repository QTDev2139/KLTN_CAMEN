import { Container } from '@mui/material';
import { ReactNode } from 'react';

export interface ContainerWrapperProp {
  children: ReactNode;
}

export default function ContainerWrapper({ children }: ContainerWrapperProp) {
    return <Container maxWidth="lg">{children}</Container>
}
