import { Card, CardContent, CardMedia, Divider, Grid, Rating, Stack, Typography, useTheme } from '@mui/material';
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

const ProductDomesticPage: React.FC = () => {
  const [category, setCategory] = useState<Category[]>([]);
  const [product, setProduct] = useState<Product[]>([]);
  const { lang = 'vi', slug = 'san-pham' } = useParams<{ lang?: 'vi' | 'en'; slug?: string }>();
  const { palette } = useTheme();

  useEffect(() => {
    const fetchApi = async () => {
      console.log(category); // chưa xong phần route trên đầu

      const result = await categoryApi.getCategory(lang);
      setCategory(result);
    };
    fetchApi();
  }, [lang]);
  useEffect(() => {
    const fetchApi = async () => {
      const result = await productApi.getProductToCategory(slug, lang);
      setProduct(result);
      console.log(result)

    };
    fetchApi();
  }, [slug, lang]);

  return (
    <Grid container spacing={2}>
      <Grid size={{ md: 2 }}>
        <Stack>
          <Typography variant="h6">Danh mục</Typography>
          <Divider />
          {category.map((item) => (
            <NavLink
              key={item.id}
              to={`/${lang}/${PATH.SITE_SCREEN.PRODUCT.DOMESTIC}/${item.category_translation[0].slug}`}
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
            <Link to={`/${lang}/${PATH.SITE_SCREEN.PRODUCT.ROOT}/${item.product_translations[0].slug}`}>
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
                  <Typography variant="subtitle2" sx={{ ...getLimitLineCss(2) }}>
                    {item.product_translations[0].description}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ color: palette.primary.main, height: '60px' }}>
                    {FormatPrice(item.price)}
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
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default ProductDomesticPage;
