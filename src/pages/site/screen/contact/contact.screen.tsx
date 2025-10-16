import { Stack, Typography, useTheme } from '@mui/material';
import ContactForm from '~/components/elements/forms/contact/contact-form';
import IconLabel from '~/components/elements/icon-label/icon-label.element';
import { StackRow } from '~/components/elements/styles/stack.style';
import { HereMap } from '~/components/map/map';

const ContactPage: React.FC = () => {
  const { palette } = useTheme();
  return (
    <Stack>
      <Typography variant="h2">LIÊN HỆ</Typography>
      <Typography variant="h5" style={{ color: palette.primary.main, padding: '40px 0' }}>
        Cà Mèn Quán
      </Typography>
      <Typography variant="subtitle1" style={{ color: palette.text.primary, maxWidth: 800 }}>
        <b>“Mang Ẩm thực Việt đi muôn phương”</b>, Cà Mèn mong muốn có thể mang những món đặc sản của quê hương Việt Nam
        đi phục vụ bà con trong và ngoài nước, góp phần quảng bá mảnh đất, con người quê hương Việt Nam đến với bạn bè
        thế giới.
      </Typography>
      <IconLabel icon="Home" title="Cà Mèn Quán: 27B Hoa Sứ, Phường 7, Q.Phú Nhuận, TP.HCM" />
      <IconLabel icon="Home" title="Văn phòng: 17 Hồ Hảo Hớn, Phường Cô Giang, Quận 1, TP.HCM" />
      <IconLabel icon="Phone" title="0823 10 74 74" />
      <IconLabel icon="Email" title="happy@camen.vn" />
      <StackRow sx={{ margin: '20px 0', gap: 4 }}>
        <Stack sx={{ width: '400px' }}>
          <HereMap />
        </Stack>
        <Stack sx={{ flex: 1, minWidth: 300 }}>
          <ContactForm />
        </Stack>
      </StackRow>
    </Stack>
  );
}
export default ContactPage;