import React from 'react';
import { Box, Container, Typography, useTheme, Grid, Paper, Fade, Zoom, Button } from '@mui/material';

import Banner from '~/assets/images/banner.jpg';
import AEON from '~/assets/images/aeon.jpg';
import Emart from '~/assets/images/emart.jpg';
import LongBeach from '~/assets/images/long-beach.jpg';
import ANH from '~/assets/images/anh.jpg';
import AUSVIET from '~/assets/images/ausviet.jpg';
import COOPMART from '~/assets/images/coopmart.jpg';
import KINGFOOD from '~/assets/images/kingfood.jpg';
import LONGDAN from '~/assets/images/long-dan.jpg';
import MENAGOURMET from '~/assets/images/mena.jpg';
import DSC_9677 from '~/assets/images/DSC_9677.jpg';
import KHOINGUON from '~/assets/images/khoi-nguon.jpg';
import VUONMINH from '~/assets/images/vuon-minh.jpg';
import DOIMOI from '~/assets/images/doi-moi.jpg';
import TINHTHAN from '~/assets/images/IMG_7626.jpg';

import { fadeInUp, scrollAnimation, slideInLeft, slideInRight, getTimelineData } from './home.state';
import { useTranslation } from 'react-i18next';

const HomePage: React.FC = () => {
  const { t } = useTranslation('home');
  const timelineData = React.useMemo(() => getTimelineData(t), [t]);

  const { palette } = useTheme();
  const [isVisible, setIsVisible] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState<string>('camen');

  // Refs cho các section
  const camenRef = React.useRef<HTMLDivElement>(null);
  const founderRef = React.useRef<HTMLDivElement>(null);
  const historyRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setIsVisible(true);
  }, []);

  // Hàm scroll smooth đến section
  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      const offsetTop = ref.current.offsetTop - 120; // 120px = sticky nav height + padding
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
    }
  };

  return (
    <Box component="main">
      {/* Hero Banner - Full Width */}
      <Box
        component="img"
        src={Banner}
        alt="Banner"
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          display: 'block',
        }}
      />

      {/* Sticky Navigation Buttons */}
      <Box
        sx={{
          position: 'sticky',
          top: '66px',
          zIndex: 99,
          bgcolor: 'background.paper',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderBottom: `1px solid ${palette.divider}`,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: { xs: 1, md: 2 },
              py: 2,
              flexWrap: 'wrap',
            }}
          >
            <Button
              variant={activeSection === 'camen' ? 'contained' : 'outlined'}
              onClick={() => {
                setActiveSection('camen');
                scrollToSection(camenRef);
              }}
              sx={{
                px: { xs: 2, md: 4 },
                py: 1,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: { xs: '0.875rem', md: '1rem' },
                fontWeight: 600,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 3,
                },
              }}
            >
              {t('about_us_section_title')}
            </Button>
            <Button
              variant={activeSection === 'founder' ? 'contained' : 'outlined'}
              onClick={() => {
                setActiveSection('founder');
                scrollToSection(founderRef);
              }}
              sx={{
                px: { xs: 2, md: 4 },
                py: 1,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: { xs: '0.875rem', md: '1rem' },
                fontWeight: 600,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 3,
                },
              }}
            >
              {t('nav_founder_spirit')}
            </Button>
            <Button
              variant={activeSection === 'history' ? 'contained' : 'outlined'}
              onClick={() => {
                setActiveSection('history');
                scrollToSection(historyRef);
              }}
              sx={{
                px: { xs: 2, md: 4 },
                py: 1,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: { xs: '0.875rem', md: '1rem' },
                fontWeight: 600,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 3,
                },
              }}
            >
              {t('nav_history')}
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Section 4: Đối Tác */}
      <Box
        sx={{
          py: { xs: 6, md: 10 },
          bgcolor: palette.background.paper,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Zoom in={isVisible} timeout={800}>
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Typography
                variant="h3"
                component="h2"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  color: palette.primary.main,
                  fontSize: { xs: '1.75rem', md: '2.5rem' },
                }}
              >
                {t('partners_section_title')}
              </Typography>
              <Box
                sx={{
                  width: '80px',
                  height: '4px',
                  bgcolor: palette.primary.main,
                  margin: '0 auto',
                  borderRadius: '2px',
                  mb: 2,
                }}
              />
              <Typography
                variant="body1"
                sx={{
                  color: palette.text.secondary,
                  maxWidth: '600px',
                  margin: '0 auto',
                }}
              >
                {t('partners_section_subtitle')}
              </Typography>
            </Box>
          </Zoom>

          {/* Partners Slider */}
          <Box
            sx={{
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                width: '100px',
                background: `linear-gradient(to right, ${palette.background.paper}, transparent)`,
                zIndex: 2,
                pointerEvents: 'none',
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                width: '100px',
                background: `linear-gradient(to left, ${palette.background.paper}, transparent)`,
                zIndex: 2,
                pointerEvents: 'none',
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                animation: `${scrollAnimation} 30s linear infinite`,
                '&:hover': {
                  animationPlayState: 'paused',
                },
              }}
            >
              {/* First set of partners */}
              {[AUSVIET, AEON, Emart, LongBeach, ANH, COOPMART, KINGFOOD, LONGDAN, MENAGOURMET].map((logo, index) => (
                <Box
                  key={`partner-${index}`}
                  sx={{
                    flex: '0 0 auto',
                    width: { xs: '180px', md: '220px' },
                    mx: 2,
                  }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      height: '140px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 3,
                      border: `1px solid ${palette.divider}`,
                      background: '#fff',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: `0 8px 24px ${palette.primary.main}20`,
                        borderColor: palette.primary.main,
                      },
                    }}
                  >
                    <Box
                      component="img"
                      src={logo}
                      alt={logo.replace(/\.(png|jpg)$/, '')}
                      sx={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain',
                      }}
                    />
                  </Paper>
                </Box>
              ))}
              {/* Duplicate set for seamless loop */}
              {[AUSVIET, AEON, Emart, LongBeach, ANH, COOPMART, KINGFOOD, LONGDAN, MENAGOURMET].map((logo, index) => (
                <Box
                  key={`partner-duplicate-${index}`}
                  sx={{
                    flex: '0 0 auto',
                    width: { xs: '180px', md: '220px' },
                    mx: 2,
                  }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      height: '140px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 3,
                      border: `1px solid ${palette.divider}`,
                      background: '#fff',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: `0 8px 24px ${palette.primary.main}20`,
                        borderColor: palette.primary.main,
                      },
                    }}
                  >
                    <Box
                      component="img"
                      src={logo}
                      alt={logo.replace(/\.(png|jpg)$/, '')}
                      sx={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain',
                      }}
                    />
                  </Paper>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Trust indicators */}
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Grid container spacing={3} justifyContent="center">
              {[
                { number: t('about_partners_count'), label: t('about_partners_text') },
                { number: t('about_countries_count'), label: t('about_countries_text') },
                { number: t('about_customers_count'), label: t('about_countries_text') },
              ].map((stat, index) => (
                <Grid size={{ xs: 12, sm: 4 }} key={index}>
                  <Box
                    sx={{
                      animation: `${fadeInUp} 0.8s ease-out`,
                      animationDelay: `${1 + index * 0.1}s`,
                      animationFillMode: 'both',
                    }}
                  >
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        color: palette.primary.main,
                        mb: 1,
                        fontSize: { xs: '2rem', md: '2.5rem' },
                      }}
                    >
                      {stat.number}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: palette.text.secondary,
                        fontWeight: 500,
                      }}
                    >
                      {stat.label}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>

      {/* Section 1: Về Cà Mèn */}
      <Box
        ref={camenRef}
        id="camen-section"
        sx={{
          py: { xs: 6, md: 10 },
          background: `linear-gradient(135deg, ${palette.background.paper} 0%, ${palette.grey[50]} 100%)`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative background shapes */}
        <Box
          sx={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${palette.primary.light}22 0%, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -150,
            left: -150,
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${palette.primary.main}15 0%, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Zoom in={isVisible} timeout={800}>
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Typography
                variant="h3"
                component="h2"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  color: palette.primary.main,
                  fontSize: { xs: '1.75rem', md: '2.5rem' },
                  animation: `${fadeInUp} 0.8s ease-out`,
                }}
              >
                {t('about_us_section_title')}
              </Typography>
              <Box
                sx={{
                  width: '80px',
                  height: '4px',
                  bgcolor: palette.primary.main,
                  margin: '0 auto',
                  borderRadius: '2px',
                }}
              />
            </Box>
          </Zoom>

          {/* Main Content */}
          <Grid container spacing={4} sx={{ mb: 6 }}>
            {/* Image Area */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  animation: `${slideInLeft} 1s ease-out`,
                  animationDelay: '0.2s',
                  animationFillMode: 'both',
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    position: 'relative',
                    height: { xs: '350px', md: '450px' },
                    borderRadius: 4,
                    overflow: 'hidden',
                    background: `linear-gradient(135deg, ${palette.primary.light} 0%, ${palette.primary.main} 100%)`,
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'scale(1.02) translateY(-8px)',
                      boxShadow: `0 20px 40px ${palette.primary.main}40`,
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 100%)',
                      opacity: 0,
                      transition: 'opacity 0.4s ease',
                    },
                    '&:hover::before': {
                      opacity: 1,
                    },
                  }}
                >
                  {/* IMAGE: full cover và nằm giữa */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                    }}
                  >
                    <Box
                      component="img"
                      src={DSC_9677}
                      alt="Cà Mèn"
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center',
                        display: 'block',
                      }}
                    />
                  </Box>
                </Paper>
              </Box>
            </Grid>

            {/* Content Area */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  animation: `${slideInRight} 1s ease-out`,
                  animationDelay: '0.4s',
                  animationFillMode: 'both',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    lineHeight: 2,
                    color: palette.text.primary,
                    fontSize: { xs: '1rem', md: '1.1rem' },
                    textAlign: 'justify',
                    mb: 3,
                    position: 'relative',
                    pl: 3,
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: '4px',
                      background: `linear-gradient(to bottom, ${palette.primary.main}, ${palette.primary.light})`,
                      borderRadius: '2px',
                    },
                  }}
                >
                  {t('history_paragraph_1')}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    lineHeight: 2,
                    color: palette.text.primary,
                    fontSize: { xs: '1rem', md: '1.1rem' },
                    textAlign: 'justify',
                  }}
                >
                  {t('history_paragraph_2')}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Stats Cards */}
          <Grid container spacing={3}>
            {[
              {
                number: '2015',
                label: t('milestone_2015'),
                description: t('milestone_2015_des'),
                image: KHOINGUON,
              },
              {
                number: '2022',
                label: t('milestone_2022'),
                description: t('milestone_2022_des'),
                image: DOIMOI,
              },
              {
                number: '2023',
                label: t('milestone_2023'),
                description: t('milestone_2023_des'),
                image: VUONMINH,
              },
            ].map((item, index) => (
              <Grid size={{ xs: 12, sm: 4 }} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    position: 'relative',
                    borderRadius: 3,
                    background: '#fff',
                    border: `1px solid ${palette.divider}`,
                    overflow: 'hidden',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    animation: `${fadeInUp} 0.8s ease-out`,
                    animationDelay: `${0.6 + index * 0.1}s`,
                    animationFillMode: 'both',
                    '&:hover': {
                      transform: 'translateY(-12px)',
                      boxShadow: `0 12px 24px ${palette.primary.main}20`,
                      borderColor: palette.primary.main,
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: index === 2 ? 0 : '50%',
                      height: '3px',
                      background: `linear-gradient(to right, ${palette.primary.main}, ${
                        index === 2 ? palette.primary.main : palette.primary.light
                      })`,
                      opacity: 0.6,
                    },
                    '&::after':
                      index === 2
                        ? {}
                        : {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            width: '50%',
                            height: '3px',
                            background: `linear-gradient(to right, ${palette.primary.light}, transparent)`,
                            opacity: 0.3,
                          },
                  }}
                >
                  {/* Image */}
                  <Box
                    sx={{
                      position: 'relative',
                      height: 180,
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      component="img"
                      src={item.image}
                      alt="Cà Mèn"
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center',
                        display: 'block',
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `linear-gradient(to bottom, transparent 0%, ${palette.primary.main}15 100%)`,
                        opacity: 0.12,
                      }}
                    />
                  </Box>

                  {/* Content */}
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        color: palette.primary.main,
                        mb: 1,
                        fontSize: { xs: '1.75rem', md: '2rem' },
                      }}
                    >
                      {item.number}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: palette.text.primary,
                        mb: 1,
                      }}
                    >
                      {item.label}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: palette.text.secondary,
                        lineHeight: 1.6,
                      }}
                    >
                      {item.description}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Section 2: Tinh Thần Người Sáng Lập */}
      <Box
        ref={founderRef}
        id="founder-section"
        sx={{
          py: { xs: 6, md: 10 },
          bgcolor: palette.background.default,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative elements */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: -200,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${palette.primary.main}08 0%, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Zoom in={isVisible} timeout={800}>
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Typography
                variant="h3"
                component="h2"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  color: palette.primary.main,
                  fontSize: { xs: '1.75rem', md: '2.5rem' },
                }}
              >
                {t('mission_section_title')}
              </Typography>
              <Box
                sx={{
                  width: '80px',
                  height: '4px',
                  bgcolor: palette.primary.main,
                  margin: '0 auto',
                  borderRadius: '2px',
                }}
              />
            </Box>
          </Zoom>

          <Grid container spacing={6} alignItems="center">
            {/* Left - Content */}
            <Grid size={{ xs: 12, md: 6 }} order={{ xs: 2, md: 1 }}>
              <Box
                sx={{
                  animation: `${slideInLeft} 1s ease-out`,
                  animationDelay: '0.2s',
                  animationFillMode: 'both',
                }}
              >
                {/* Decorative quote mark */}
                <Box
                  sx={{
                    fontSize: { xs: '4rem', md: '6rem' },
                    fontWeight: 700,
                    color: palette.primary.main,
                    opacity: 0.2,
                    lineHeight: 0.8,
                    mb: 2,
                    fontFamily: 'Georgia, serif',
                  }}
                >
                  "
                </Box>

                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    color: palette.primary.main,
                    mb: 3,
                    fontSize: { xs: '1.25rem', md: '1.5rem' },
                    lineHeight: 1.6,
                  }}
                >
                  {t('mission_slogan')}
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    lineHeight: 2,
                    color: palette.text.primary,
                    fontSize: { xs: '1rem', md: '1.1rem' },
                    mb: 3,
                    textAlign: 'justify',
                  }}
                >
                  {t('mission_paragraph_1')}
                </Typography>

                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    background: `linear-gradient(135deg, ${palette.primary.light}15 0%, ${palette.primary.main}10 100%)`,
                    borderLeft: `4px solid ${palette.primary.main}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateX(8px)',
                      boxShadow: 3,
                    },
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      fontStyle: 'italic',
                      color: palette.text.secondary,
                      lineHeight: 1.8,
                      fontSize: { xs: '0.95rem', md: '1rem' },
                    }}
                  >
                    {t('mission_quote')}
                  </Typography>
                </Paper>
              </Box>
            </Grid>

            {/* Right - Large Featured Image */}
            <Grid size={{ xs: 12, md: 6 }} order={{ xs: 1, md: 2 }}>
              <Box
                sx={{
                  animation: `${slideInRight} 1s ease-out`,
                  animationDelay: '0.4s',
                  animationFillMode: 'both',
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    position: 'relative',
                    borderRadius: 4,
                    overflow: 'hidden',
                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'scale(1.03)',
                      boxShadow: `0 20px 60px ${palette.primary.main}30`,
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: `linear-gradient(135deg, ${palette.primary.main}20 0%, transparent 50%)`,
                      opacity: 0,
                      transition: 'opacity 0.5s ease',
                      zIndex: 1,
                    },
                    '&:hover::before': {
                      opacity: 1,
                    },
                  }}
                >
                  {/* Decorative border frame */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 16,
                      left: 16,
                      right: 16,
                      bottom: 16,
                      border: `2px solid ${palette.primary.main}40`,
                      borderRadius: 3,
                      zIndex: 2,
                      pointerEvents: 'none',
                      transition: 'all 0.5s ease',
                    }}
                  />

                  {/* Image placeholder */}
                  <Box
                    sx={{
                      height: { xs: '400px', md: '550px' },
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      component="img"
                      src={TINHTHAN}
                      alt="Cà Mèn"
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center',
                        display: 'block',
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        background: `linear-gradient(135deg, ${palette.primary.light} 0%, ${palette.primary.main} 100%)`,
                        opacity: 0.12,
                      }}
                    />
                  </Box>

                  {/* Decorative corner accents */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: 60,
                      height: 60,
                      borderTop: `4px solid ${palette.primary.main}`,
                      borderLeft: `4px solid ${palette.primary.main}`,
                      borderRadius: '16px 0 0 0',
                      zIndex: 3,
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      width: 60,
                      height: 60,
                      borderBottom: `4px solid ${palette.primary.main}`,
                      borderRight: `4px solid ${palette.primary.main}`,
                      borderRadius: '0 0 16px 0',
                      zIndex: 3,
                    }}
                  />
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Section 3: Lịch Sử Hình Thành */}
      <Box
        ref={historyRef}
        id="history-section"
        sx={{
          py: { xs: 6, md: 10 },
          background: `linear-gradient(135deg, ${palette.background.paper} 0%, ${palette.grey[50]} 100%)`,
        }}
      >
        <Container maxWidth="lg">
          <Zoom in={isVisible} timeout={800}>
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography
                variant="h3"
                component="h2"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  color: palette.primary.main,
                  fontSize: { xs: '1.75rem', md: '2.5rem' },
                }}
              >
                {t('history_section_title')}
              </Typography>
              <Box
                sx={{
                  width: '80px',
                  height: '4px',
                  bgcolor: palette.primary.main,
                  margin: '0 auto 24px',
                  borderRadius: '2px',
                }}
              />
              <Typography
                variant="body1"
                sx={{
                  color: palette.text.secondary,
                  maxWidth: '800px',
                  margin: '0 auto',
                  lineHeight: 1.8,
                  fontSize: { xs: '1rem', md: '1.1rem' },
                }}
              >
                {t('history_intro_paragraph')}
              </Typography>
            </Box>
          </Zoom>

          {/* Timeline */}
          <Box sx={{ position: 'relative', mt: 4 }}>
            {/* Vertical line */}
            <Box
              sx={{
                position: 'absolute',
                left: { xs: '20px', md: '50%' },
                top: 0,
                bottom: 0,
                width: '3px',
                bgcolor: palette.primary.main,
                transform: { xs: 'none', md: 'translateX(-50%)' },
                opacity: 0.3,
              }}
            />

            {timelineData.map((item, index) => (
              <Box
                key={item.year}
                sx={{
                  position: 'relative',
                  mb: 8,
                  animation: `${fadeInUp} 0.8s ease-out`,
                  animationDelay: `${index * 0.2}s`,
                  animationFillMode: 'both',
                }}
              >
                <Grid container spacing={4} alignItems="flex-start">
                  {/* Year marker */}
                  <Grid size={{ xs: 12, md: 6 }} order={{ xs: 1, md: index % 2 === 0 ? 1 : 2 }}>
                    <Box
                      sx={{
                        textAlign: { xs: 'left', md: index % 2 === 0 ? 'right' : 'left' },
                        pl: { xs: 5, md: 0 },
                        pr: { xs: 0, md: index % 2 === 0 ? 4 : 0 },
                      }}
                    >
                      {/* Timeline dot */}
                      <Box
                        sx={{
                          position: 'absolute',
                          left: { xs: '11px', md: '50%' },
                          transform: { xs: 'none', md: 'translateX(-50%)' },
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          bgcolor: palette.primary.main,
                          border: `4px solid ${palette.background.paper}`,
                          boxShadow: 3,
                          zIndex: 2,
                        }}
                      />

                      <Typography
                        variant="h3"
                        sx={{
                          fontWeight: 700,
                          color: palette.primary.main,
                          mb: 2,
                          fontSize: { xs: '2rem', md: '2.5rem' },
                        }}
                      >
                        {item.year}
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 600,
                          mb: 2,
                          color: palette.text.primary,
                        }}
                      >
                        {item.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          lineHeight: 1.8,
                          color: palette.text.secondary,
                        }}
                      >
                        {item.description}
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Images */}
                  <Grid size={{ xs: 12, md: 6 }} order={{ xs: 2, md: index % 2 === 0 ? 2 : 1 }}>
                    <Box
                      sx={{
                        pl: { xs: 5, md: index % 2 === 0 ? 0 : 4 },
                        pr: { xs: 0, md: index % 2 === 0 ? 0 : 0 },
                      }}
                    >
                      <Grid container spacing={2}>
                        {item.images.map((image, imgIndex) => (
                          <Grid size={{ xs: imgIndex === 0 ? 12 : 6, md: imgIndex === 0 ? 12 : 6 }} key={imgIndex}>
                            <Paper
                              elevation={3}
                              sx={{
                                overflow: 'hidden',
                                borderRadius: 2,
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                '&:hover': {
                                  transform: 'scale(1.05)',
                                  boxShadow: 6,
                                },
                              }}
                            >
                              <Box
                                component="img"
                                src={image}
                                alt={`${item.year} - ${imgIndex + 1}`}
                                sx={{
                                  width: '100%',
                                  height: imgIndex === 0 ? { xs: '250px', md: '300px' } : { xs: '150px', md: '180px' },
                                  objectFit: 'cover',
                                  display: 'block',
                                }}
                              />
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>
    </Box>
  );
};
export default HomePage;
