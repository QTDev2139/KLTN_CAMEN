import { Stack } from '@mui/material';
import React from 'react';
import { BORDER_RADIUS_ELEMENT_WRAPPER } from '~/common/constant/style.constant';

import type { SxProps } from '@mui/material';

interface BoxFormProps {
  children: React.ReactNode;
  sx?: SxProps;
}

export const BoxForm: React.FC<BoxFormProps> = ({ children, sx }) => {
  return (
    <Stack
      sx={{
        position: 'relative',
        minHeight: '100vh',
        ...sx
      }}
    >
      <Stack
        sx={{
          padding: `${BORDER_RADIUS_ELEMENT_WRAPPER} 40px`,
          border: '1px solid #ccc',
          minWidth: '360px',
          borderRadius: BORDER_RADIUS_ELEMENT_WRAPPER,
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          margin: 'auto',
        }}
      >
        {children}
      </Stack>
    </Stack>
  );
};
