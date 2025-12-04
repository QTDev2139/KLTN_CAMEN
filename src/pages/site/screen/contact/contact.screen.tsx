import { Stack, Typography, useTheme } from '@mui/material';
import { PADDING_GAP_LAYOUT } from '~/common/constant/style.constant';
import ContainerWrapper from '~/components/elements/container/container.element';
import ContactForm from '~/components/elements/forms/contact/contact-form';
import IconLabel from '~/components/elements/icon-label/icon-label.element';
import { StackRow } from '~/components/elements/styles/stack.style';
// import { HereMap } from '~/components/map/map';

const ContactPage: React.FC = () => {
  const { palette } = useTheme();
  return (
    <ContainerWrapper sx={{ padding: PADDING_GAP_LAYOUT }}>
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
        <Stack sx={{ width: '500px' }}>
          <div className="embed-map-fixed">
            <div className="embed-map-container">
              <iframe
                title="Cà Mèn Quán location map"
                className="embed-map-frame"
                frameBorder="0"
                marginHeight={0}
                marginWidth={0}
                src="https://maps.google.com/maps?width=500&height=400&hl=en&q=10.760370242318197%2C%20106.69334454379866&t=&z=14&ie=UTF8&iwloc=B&output=embed"
              ></iframe>
              <a
                href="https://sprunkiretake.net"
                style={{
                  fontSize: '2px',
                  color: 'gray',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  zIndex: 1,
                  maxHeight: '1px',
                  overflow: 'hidden',
                }}
              >
                sprunki retake
              </a>
            </div>
            <style>{`.embed-map-fixed{position:relative;text-align:right;width:500px;height:400px;}.embed-map-container{overflow:hidden;background:none!important;width:500px;height:400px;}.embed-map-frame{width:500px!important;height:400px!important;}`}</style>
          </div>
        </Stack>
        <Stack sx={{ flex: 1, minWidth: 300 }}>
          <ContactForm />
        </Stack>
      </StackRow>
    </ContainerWrapper>
  );
};
export default ContactPage;
