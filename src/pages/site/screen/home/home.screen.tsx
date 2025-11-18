import { useTheme } from '@mui/material';
import ChatBox from '~/components/chat/chat-box';

const HomePage:React.FC = () => {
  const { palette } = useTheme();
  return (
    <>
      <span style={{ color: palette.primary.main }}>Home Page</span>
      <ChatBox authUser={{ id: 1 }} />
    </>
  );
}
export default HomePage;
