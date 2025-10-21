import { Box, Button, ButtonGroup, Grid, Stack, Typography, useTheme } from '@mui/material';
import { StackRow } from '~/components/elements/styles/stack.style';
import { PADDING_GAP_LAYOUT } from '~/common/constant/style.constant';
import React, { useEffect, useState } from 'react';
import ModalImage from '~/components/elements/modal-image/modal-image.element';
import { SliderProduct, SliderProductItems } from '~/components/elements/slider/slider.element';

import ProductChao from '~/assets/images/product-chao.png';
import ProductMien from '~/assets/images/product-mien.png';
import { useNavigate, useParams } from 'react-router-dom';
import { productApi } from '~/apis';
import { ProductDetail } from '~/apis/product/product.interface.api';
import { PATH } from '~/router';
import { BoxContent } from '~/components/elements/forms/box/box-content';
import { FormatPrice } from '~/components/elements/format-price/format-price.element';
import { ShoppingCartOutlined } from '@mui/icons-material';

export default function ProductDetailPage() {
  const { palette } = useTheme();
  const [open, setOpen] = React.useState(false);
  const { lang, slug } = useParams<{ lang: 'vi' | 'en'; slug: string }>();
  const [productDetail, setProductDetail] = useState<ProductDetail | null>();
  const [qty, setQty] = useState(1);
  const [mainImage, setMainImage] = useState(productDetail?.product_images[0].image_url);
  const [modalSrc, setModalSrc] = useState('');

  const navigate = useNavigate();
  useEffect(() => {
    const fetchApi = async () => {
      if (!slug || !lang) return;
      const result = await productApi.getDetailProduct(slug, lang);
      setProductDetail(result);
      if (result.product_translations[0].slug && result.product_translations[0].slug !== slug) {
        navigate(`/${lang}/${PATH.SITE_SCREEN.PRODUCT.ROOT}/${result.product_translations[0].slug}`, { replace: true });
      }
    };
    fetchApi();
  }, [lang]);

  useEffect(() => {
    if (productDetail?.product_images?.length) {
      setMainImage(productDetail.product_images[0].image_url);
    }
  }, [productDetail]);

  console.log('product: ', mainImage);

  const handlePrev = () => {
    setQty(qty - 1);
  };
  const handlePlus = () => {
    setQty(qty + 1);
  };

  const items: SliderProductItems[] = [
    { src: ProductChao, title: 'Cháo bột cá lóc' },
    { src: ProductMien, title: 'Miến cá lóc' },
    { src: ProductChao, title: 'Cháo tôm' },
    { src: ProductMien, title: 'Cháo tôm thịt' },
    { src: ProductMien, title: 'Miến cá lóc' },
  ];

  return (
    <Stack sx={{ backgroundColor: palette.background.default }}>
      <StackRow sx={{ display: 'grid', gridTemplateColumns: '5fr 7fr', gap: 4, marginBottom: '40px' }}>
        <Stack>
          <BoxContent>
            <Box sx={{ padding: '10px 0', transition: 'all 0.2s ease-in-out' }} onClick={() => setOpen(true)}>
              <img src={mainImage} alt="Sản phẩm" style={{ display: 'block', maxWidth: '100%' }} />
            </Box>
          </BoxContent>
          <StackRow sx={{ margin: '20px' }} gap={1}>
            {productDetail?.product_images.map((img, idx) => (
              <Box
                key={idx}
                sx={{
                  maxWidth: '60px',
                  height: '60px',
                  border: `2px solid ${
                    mainImage === img.image_url ? palette.primary.main : palette.background.default
                  }`,
                  padding: '8px 12px',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    borderColor: palette.primary.main,
                  },
                }}
                onClick={() => {
                  setMainImage(img.image_url);
                  setModalSrc(img.image_url);
                }}
                onMouseEnter={() => {
                  setMainImage(img.image_url);
                  setModalSrc(img.image_url);
                }}
              >
                <img
                  src={img.image_url}
                  alt="Sản phẩm"
                  style={{ display: 'block', maxWidth: '100%', height: '100%' }}
                />
              </Box>
            ))}
          </StackRow>
          <ModalImage open={open} onClose={() => setOpen(false)} src={modalSrc} alt="Sản phẩm" />
        </Stack>
        <Stack sx={{ position: 'relative', top: '-40%', transform: 'translateY(50%)' }}>
          <Typography variant="h2" sx={{ paddingBottom: '16px' }}>
            {productDetail?.product_translations[0].name}
          </Typography>
          <Typography variant="subtitle1">{productDetail?.product_translations[0].description}</Typography>
          <Typography variant="h5" sx={{ color: palette.primary.main }}>
            {FormatPrice(productDetail?.price ?? 0)}
          </Typography>
          <StackRow sx={{ paddingTop: PADDING_GAP_LAYOUT }} gap={1}>
            <Typography variant="subtitle1">Số lượng: </Typography>
            <ButtonGroup variant="outlined" color="inherit" size="small" sx={{ color: palette.text.primary }}>
              {/* disable khi qty = 1 để không giảm xuống 0 */}
              <Button onClick={() => handlePrev()} disabled={qty === 1}>
                -
              </Button>
              <Button style={{ userSelect: 'text', cursor: 'text' }}>{qty}</Button>
              <Button onClick={() => handlePlus()}>+</Button>
            </ButtonGroup>
          </StackRow>
          <StackRow gap={2} sx={{ paddingTop: PADDING_GAP_LAYOUT }}>
            <Button
              variant="outlined"
              startIcon={<ShoppingCartOutlined />}
              sx={{
                color: palette.primary.main,
                borderColor: palette.primary.main,
                backgroundColor: palette.primary.light,
                textTransform: 'none',
                px: 3,
                '&:hover': {
                  opacity: '0.9',
                },
              }}
            >
              Thêm Vào Giỏ Hàng
            </Button>

            {/* Nút Mua ngay */}
            <Button
              variant="contained"
              sx={{
                backgroundColor: palette.primary.main,
                color: palette.primary.light,
                textTransform: 'none',
                px: 4,
                '&:hover': {
                  opacity: '0.9',
                },
              }}
            >
              Mua Ngay
            </Button>
          </StackRow>
        </Stack>
      </StackRow>

      <Grid container spacing={2}>
        <Grid size={{ md: 6 }}>
          <BoxContent title="Giá trị dinh dưỡng" content={productDetail?.product_translations[0].nutrition_info} />
        </Grid>
        <Grid size={{ md: 6 }}>
          <BoxContent title="Hướng dẫn sử dụng" content={productDetail?.product_translations[0].usage_instruction} />
        </Grid>
      </Grid>
      <Typography variant="h2" sx={{ padding: `${PADDING_GAP_LAYOUT} 0`, color: palette.primary.main }}>
        Sản phẩm tương tự
      </Typography>
      <SliderProduct items={items} />
    </Stack>
  );
}
