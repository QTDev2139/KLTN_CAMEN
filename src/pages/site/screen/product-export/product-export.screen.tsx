import { Card, CardContent, CardMedia, Grid, Typography, useTheme, Box, Container, Fade, Paper } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productApi } from '~/apis';
import { Product } from '~/apis/product/product.interface.api';
import { getLimitLineCss } from '~/common/until/get-limit-line-css';
import { StackRowAlignCenter } from '~/components/elements/styles/stack.style';
import { LocationOn, VerifiedUser, Public } from '@mui/icons-material';
import { useLang } from '~/hooks/use-lang/use-lang';
import { getLangPrefix } from '~/common/constant/get-lang-prefix';
import { PATH } from '~/router';
import ContainerWrapper from '~/components/elements/container/container.element';
import { PADDING_GAP_LAYOUT } from '~/common/constant/style.constant';
import { keyframes } from '@mui/system';

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

const ProductExportPage: React.FC = () => {
  const [product, setProduct] = useState<Product[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const currentLang = useLang();
  const prefix = getLangPrefix(currentLang);
  const { palette } = useTheme();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const result = await productApi.getProduct(currentLang, 'export');
        setProduct(result);
      } catch (err) {
        console.error(err);
      }
    };
    fetchApi();
  }, [currentLang]);

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
              'url("https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1600&auto=format&fit=crop")',
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
                <Public sx={{ fontSize: 20, color: palette.primary.main }} />
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
                  Xuất khẩu quốc tế
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
                Sản Phẩm Xuất Khẩu
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
                Sản phẩm chất lượng cao đạt tiêu chuẩn quốc tế, được xuất khẩu đến các thị trường trên toàn thế giới
              </Typography>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Products Section */}
      <Box sx={{ py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {product.map((item, idx) => (
              <Grid key={idx} size={{ md: 4 }}>
                <Link
                  to={`${prefix}/${PATH.SITE_SCREEN.PRODUCT.ROOT}/${item.product_translations[0].slug}`}
                  style={{ textDecoration: 'none' }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      border: `1px solid ${palette.primary.main}15`,
                      borderRadius: 2,
                      '&:hover': {
                        border: `1px solid ${palette.primary.main}`,
                        transform: 'translateY(-4px)',
                        transition: 'all 0.4s ease',
                        boxShadow: `0 8px 24px ${palette.primary.main}20`,
                      },
                    }}
                  >
                    <CardMedia component="img" height="220" image={item.product_images[0].image_url} alt="Product" />
                    <CardContent>
                      <Typography
                        variant="subtitle1"
                        sx={{ ...getLimitLineCss(2), fontWeight: '600', textAlign: 'center', mb: 1 }}
                      >
                        {item.product_translations[0].description}
                      </Typography>
                      <Typography 
                        variant="subtitle2" 
                        sx={{ 
                          textAlign: 'center',
                          color: palette.primary.main,
                          fontWeight: 500,
                          mb: 1
                        }}
                      >
                        Sản phẩm xuất khẩu
                      </Typography>

                      {/* Price intentionally hidden for export page */}

                      <StackRowAlignCenter gap={1} sx={{ mt: 1, justifyContent: 'center' }}>
                        <LocationOn sx={{ color: palette.text.secondary, fontSize: '16px' }} />
                        <Typography variant="subtitle2" sx={{ color: palette.text.secondary, fontSize: '12px' }}>
                          {item.shipping_from}
                        </Typography>
                      </StackRowAlignCenter>
                    </CardContent>
                  </Card>
                </Link>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default ProductExportPage;
