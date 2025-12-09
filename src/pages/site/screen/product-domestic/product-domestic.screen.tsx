import { Card, CardContent, CardMedia, Divider, Grid, Rating, Stack, Typography, useTheme, Box } from '@mui/material';
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
import { LocationOn } from '@mui/icons-material';
import { useLang } from '~/hooks/use-lang/use-lang';
import { getLangPrefix } from '~/common/constant/get-lang-prefix';
import ContainerWrapper from '~/components/elements/container/container.element';
import { PADDING_GAP_LAYOUT } from '~/common/constant/style.constant';
import { useTranslation } from 'react-i18next';

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
  const { slug = 'san-pham' } = useParams<{ slug?: string }>();

  const { t } = useTranslation('category');

  // Lấy lang từ hook thay vì useParams
  const currentLang = useLang();
  const prefix = getLangPrefix(currentLang);
  const { palette } = useTheme();

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
    <ContainerWrapper sx={{ padding: PADDING_GAP_LAYOUT }}>
      <Grid container spacing={2}>
        <Grid size={{ md: 2 }}>
          <Stack>
            <Typography variant="h6">{t('category')}</Typography>
            <Divider />
            {category.map((item) => (
              <NavLink
                key={item.id}
                to={`${prefix}/${PATH.SITE_SCREEN.PRODUCT.DOMESTIC}/${item.category_translation[0].slug}`}
                style={({ isActive }: { isActive: boolean }) => ({
                  padding: `0px ${STYLE.PADDING_GAP_ITEM}`,
                  color: isActive ? palette.primary.main : palette.text.primary,
                  textDecoration: 'none',
                })}
              >
                <TypographyHover variant="subtitle1">{item.category_translation[0].name}</TypographyHover>
              </NavLink>
            ))}
          </Stack>
        </Grid>
        <Grid container size={{ md: 10 }}>
          {product.map((item, idx) => (
            <Grid key={idx} size={{ md: 4 }}>
              <Link to={`${prefix}/${PATH.SITE_SCREEN.PRODUCT.ROOT}/${item.product_translations[0].slug}`}>
                <Card
                  sx={{
                    maxWidth: 345,
                    maxHeight: 500,
                    border: `1px solid ${palette.background.paper}`,
                    '&:hover': {
                      border: `1px solid ${palette.primary.main}`,
                      transform: 'translateY(-2px)',
                      transition: 'all 500ms ease',
                    },
                  }}
                >
                  <CardMedia component="img" height="220" image={item.product_images[0].image_url} alt="Product" />
                  <CardContent>
                    <Typography variant="h6" sx={{ ...getLimitLineCss(1) }}>
                      {item.product_translations[0].name}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ ...getLimitLineCss(2) }}>
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
                          <Box component="span" sx={{ color: palette.primary.main }}>
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
                        <Box component="span" sx={{ color: palette.primary.main }}>
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
    </ContainerWrapper>
  );
};

export default ProductDomesticPage;
