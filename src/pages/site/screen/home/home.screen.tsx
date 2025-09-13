import { useTheme } from '@mui/material';

export default function HomeScreen() {
  const { palette } = useTheme();
  console.log('123');
  return (
    <>
      <p style={{ color: palette.primary.main }}>Home Page</p>
    </>
  );
}
