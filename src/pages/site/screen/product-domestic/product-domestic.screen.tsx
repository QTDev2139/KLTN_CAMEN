import { Card, CardContent, CardMedia, Divider, Grid, Rating, Stack, Typography, useTheme, Box, Container, Fade, Paper } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link, NavLink, useParams } from 'react-router-dom';
import { categoryApi, productApi } from '~/apis';
import { Category } from '~/apis/category/category.interface.api';
import { Product } from '~/apis/product/product.interface.api';
import { STYLE } from '~/common/constant';
import { getLimitLineCss } from '~/common/until/get-limit-line-css';
import { TypographyHover } from '~/components/elements/styles/link.style';
import { PATH } from '~/router';
import { FormatPrice } from '~/components/elements/format-price/format-price.element';
import { StackRowAlignCenter } from '~/components/elements/styles/stack.style';
import { LocationOn, VerifiedUser, Category as CategoryIcon } from '@mui/icons-material';
import { useLang } from '~/hooks/use-lang/use-lang';
import { getLangPrefix } from '~/common/constant/get-lang-prefix';
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

// helper to format sales count (>=1000 -> "1K", "10K", ...)
const formatSalesCount = (n: number) => {
  if (!n) return '0';
  if (n >= 1000) return `${Math.floor(n / 1000)}K`;
  return `${n}`;
};

const ProductDomesticPage: React.FC = () => {
  const [category, setCategory] = useState<Category[]>([]);
  const [product, setProduct] = useState<Product[]>([]);
  const [salesCountMap, setSalesCountMap] = useState<Record<number, number>>({});
  const [isVisible, setIsVisible] = useState(false);
  const { slug = 'san-pham' } = useParams<{ slug?: string }>();

  // Lấy lang từ hook thay vì useParams
  const currentLang = useLang();
  const prefix = getLangPrefix(currentLang);
  const { palette } = useTheme();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const result = await productApi.getSalesCount();
        // result expected like: [{ product_id: 1, sales_count: "1" }, ...]
        const map: Record<number, number> = {};
        (result || []).forEach((r: any) => {
          const id = Number(r.product_id);
          const count = Number(r.sales_count) || 0;
          if (!Number.isNaN(id)) map[id] = count;
        });
        setSalesCountMap(map);
      } catch (err) {
        console.error('Failed fetch sales count', err);
        setSalesCountMap({});
      }
    };
    fetchApi();
  }, []);

  useEffect(() => {
    const fetchApi = async () => {
      const result = await categoryApi.getCategory(currentLang);
      setCategory(result);
    };
    fetchApi();
  }, [currentLang]);

  useEffect(() => {
    const fetchApi = async () => {
      const result = await productApi.getProductByCategory(slug, currentLang);
      setProduct(result);
    };
    fetchApi();
  }, [slug, currentLang]);

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
              'url("https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&auto=format&fit=crop")',
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
                <CategoryIcon sx={{ fontSize: 20, color: palette.primary.main }} />
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
                  Sản phẩm chất lượng
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
                Sản Phẩm Nội Địa
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
                Khám phá bộ sưu tập sản phẩm nội địa cao cấp, được chọn lọc kỹ càng với chất lượng đảm bảo
              </Typography>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Products Section */}
      <Box sx={{ py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            <Grid size={{ md: 2 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: `1px solid ${palette.primary.main}20`,
                  background: '#fff',
                }}
              >
                <Typography variant="h6" sx={{ mb: 2, color: palette.primary.main, fontWeight: 600 }}>
                  Danh mục
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {category.map((item) => (
                  <NavLink
                    key={item.id}
                    to={`${prefix}/${PATH.SITE_SCREEN.PRODUCT.DOMESTIC}/${item.category_translation[0].slug}`}
                    style={({ isActive }: { isActive: boolean }) => ({
                      padding: `8px ${STYLE.PADDING_GAP_ITEM}`,
                      color: isActive ? palette.primary.main : palette.text.primary,
                      textDecoration: 'none',
                      display: 'block',
                    })}
                  >
                    <TypographyHover variant="subtitle1">{item.category_translation[0].name}</TypographyHover>
                  </NavLink>
                ))}
              </Paper>
            </Grid>
            <Grid container size={{ md: 10 }} spacing={3}>
              {product.map((item, idx) => (
                <Grid key={idx} size={{ md: 4 }}>
                  <Link to={`${prefix}/${PATH.SITE_SCREEN.PRODUCT.ROOT}/${item.product_translations[0].slug}`}>
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
                        <Typography variant="subtitle2" sx={{ ...getLimitLineCss(2), mb: 1 }}>
                          {item.product_translations[0].description}
                        </Typography>
                        {/* Hiển thị giá: nếu có giá khuyến mãi (compare_at_price > 0) thì show khuyến mãi (primary)
                          và price gạch ngang, đổi màu secondary. Ngược lại hiển thị price bình thường. */}
                        <Typography
                          variant="subtitle1"
                          sx={{ height: '60px', display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          {item.compare_at_price && Number(item.compare_at_price) > 0 ? (
                            <>
                              <Box component="span" sx={{ color: palette.primary.main, fontWeight: 600 }}>
                                {FormatPrice(item.compare_at_price)}
                              </Box>
                              <Box
                                component="span"
                                sx={{ textDecoration: 'line-through', color: palette.text.secondary, fontSize: '14px' }}
                              >
                                {FormatPrice(item.price)}
                              </Box>
                            </>
                          ) : (
                            <Box component="span" sx={{ color: palette.primary.main, fontWeight: 600 }}>
                              {FormatPrice(item.price)}
                            </Box>
                          )}
                        </Typography>
                        <StackRowAlignCenter gap={1}>
                          <Rating name="read-only" size="small" value={1} max={1} readOnly />
                          <Typography variant="subtitle2">5.0</Typography>
                        </StackRowAlignCenter>
                        <StackRowAlignCenter gap={1}>
                          <LocationOn sx={{ color: palette.text.secondary, fontSize: '16px' }} />
                          <Typography variant="subtitle2" sx={{ color: palette.text.secondary, fontSize: '12px' }}>
                            {item.shipping_from}
                          </Typography>
                        </StackRowAlignCenter>
                        <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontSize: '12px' }}>
                          Đã bán: {formatSalesCount(salesCountMap[item.id] ?? 0)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Link>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default ProductDomesticPage;
