import { useTheme } from '@mui/material';

export default function HomeScreen() {
  const { palette } = useTheme();
  return (
    <>
      <p style={{ color: palette.primary.main }}>Home Page</p>
    </>
  );
}
