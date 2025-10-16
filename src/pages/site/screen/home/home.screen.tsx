import { useTheme } from '@mui/material';

const HomePage:React.FC = () => {
  const { palette } = useTheme();
  return (
    <>
      <span style={{ color: palette.primary.main }}>Home Page</span>
    </>
  );
}
export default HomePage;
