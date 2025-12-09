import { Card, CardContent, CardMedia, Grid, Typography, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productApi } from '~/apis';
import { Product } from '~/apis/product/product.interface.api';
import { getLimitLineCss } from '~/common/until/get-limit-line-css';
import { StackRowAlignCenter } from '~/components/elements/styles/stack.style';
import { LocationOn } from '@mui/icons-material';
import { useLang } from '~/hooks/use-lang/use-lang';
import { getLangPrefix } from '~/common/constant/get-lang-prefix';
import { PATH } from '~/router';
import ContainerWrapper from '~/components/elements/container/container.element';
import { PADDING_GAP_LAYOUT } from '~/common/constant/style.constant';

const ProductExportPage: React.FC = () => {
  const [product, setProduct] = useState<Product[]>([]);
  const currentLang = useLang();
  const prefix = getLangPrefix(currentLang);
  const { palette } = useTheme();

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
    <ContainerWrapper sx={{ padding: PADDING_GAP_LAYOUT }}>
      <Grid container spacing={2}>
        {product.map((item, idx) => (
          <Grid key={idx} size={{ md: 4 }}>
            <Link
              to={`${prefix}/${PATH.SITE_SCREEN.PRODUCT.ROOT}/${item.product_translations[0].slug}`}
              style={{ textDecoration: 'none' }}
            >
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
                  <Typography variant="h6" sx={{ ...getLimitLineCss(1), textAlign: 'center' }}>
                    {item.product_translations[0].name}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{ ...getLimitLineCss(2), textAlign: 'center' }}
                  >
                    {item.product_translations[0].description}
                  </Typography>
                  {/* <Typography variant="subtitle2" sx={{ ...getLimitLineCss(2), textAlign: 'center' }}>
                    Sản phẩm xuất khẩu
                  </Typography> */}

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
    </ContainerWrapper>
  );
};

export default ProductExportPage;
