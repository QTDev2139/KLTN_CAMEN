import { Stack, Typography, useTheme, Box, Container, Fade } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { PADDING_GAP_LAYOUT } from '~/common/constant/style.constant';
import ContainerWrapper from '~/components/elements/container/container.element';
import ContactForm from '~/components/elements/forms/contact/contact-form';
import IconLabel from '~/components/elements/icon-label/icon-label.element';
import { StackRow } from '~/components/elements/styles/stack.style';
import { ContactMail, Phone } from '@mui/icons-material';
import { keyframes } from '@mui/system';
import { useEffect, useState } from 'react';
// import { HereMap } from '~/components/map/map';

// Keyframe animations
const fadeInUp = keyframes`
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`;

const float = keyframes`
    0%, 100% {
        transform: translateY(0px);
    }
    50% {
        transform: translateY(-15px);
    }
`;

const ContactPage: React.FC = () => {
  const { t } = useTranslation('contact');
  const { palette } = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <Box component="main" sx={{ bgcolor: palette.background.default }}>
      {/* Hero Banner Section */}
      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: '233px', md: '300px' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          background: `linear-gradient(135deg, ${palette.primary.main}08 0%, ${palette.secondary.main}08 100%)`,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              'url("https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1600&auto=format&fit=crop")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.05,
            filter: 'grayscale(100%)',
          },
        }}
      >
        {/* Decorative elements */}
        <Box
          sx={{
            position: 'absolute',
            top: '10%',
            right: '8%',
            width: { xs: '150px', md: '250px' },
            height: { xs: '150px', md: '250px' },
            borderRadius: '50%',
            background: `radial-gradient(circle, ${palette.primary.main}12 0%, transparent 70%)`,
            animation: `${float} 8s ease-in-out infinite`,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '10%',
            left: '5%',
            width: { xs: '120px', md: '200px' },
            height: { xs: '120px', md: '200px' },
            borderRadius: '50%',
            background: `radial-gradient(circle, ${palette.secondary.main}12 0%, transparent 70%)`,
            animation: `${float} 10s ease-in-out infinite`,
            animationDelay: '2s',
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Fade in={isVisible} timeout={1000}>
            <Box sx={{ textAlign: 'center', px: 2 }}>
              {/* Badge */}
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 3,
                  py: 1,
                  mb: 3,
                  borderRadius: 50,
                  border: `2px solid ${palette.primary.main}30`,
                  background: `${palette.primary.main}10`,
                  animation: `${fadeInUp} 1s ease-out`,
                }}
              >
                <ContactMail sx={{ fontSize: 20, color: palette.primary.main }} />
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: palette.primary.main,
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                    fontSize: { xs: '0.7rem', md: '0.8rem' },
                  }}
                >
                  Kết nối với chúng tôi
                </Typography>
              </Box>

              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontWeight: 700,
                  mb: 1.5,
                  fontSize: { xs: '1.5rem', md: '2.5rem' },
                  color: palette.text.primary,
                  animation: `${fadeInUp} 1s ease-out 0.2s`,
                  animationFillMode: 'both',
                }}
              >
                {t('section_title')}
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  mb: 2,
                  fontSize: { xs: '0.85rem', md: '1rem' },
                  maxWidth: '800px',
                  margin: '0 auto',
                  color: palette.text.secondary,
                  lineHeight: 1.6,
                  animation: `${fadeInUp} 1s ease-out 0.4s`,
                  animationFillMode: 'both',
                }}
              >
                Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn
              </Typography>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Contact Content Section */}
      <Box sx={{ py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          <Typography variant="h5" style={{ color: palette.primary.main, paddingBottom: '30px', fontWeight: 600 }}>
            {t('brand_name')}
          </Typography>
          <Typography variant="subtitle1" style={{ color: palette.text.primary, maxWidth: 800, marginBottom: '20px' }}>
            <b>{t('slogan')}</b> {t('slogan_detail')}
          </Typography>
          <IconLabel icon="Home" title={`${t('contact_info.branch_title')}: ${t('contact_info.branch_address')}`} />
          <IconLabel icon="Home" title={`${t('contact_info.office_title')}: ${t('contact_info.office_address')}`} />
          <IconLabel icon="Phone" title={t('contact_info.phone')} />
          <IconLabel icon="Email" title={t('contact_info.email')} />
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
        </Container>
      </Box>
    </Box>
  );
};
export default ContactPage;
