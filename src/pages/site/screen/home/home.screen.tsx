import { Stack, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';


export default function HomeScreen() {
  const { palette } = useTheme();

  return (
    <>
      <p style={{ color: palette.primary.main }}>Home Page</p>
    </>
  );
}
