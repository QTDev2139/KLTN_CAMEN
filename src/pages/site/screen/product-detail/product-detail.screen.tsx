import { Avatar, Badge, Box, Button, ButtonGroup, Grid, Rating, Stack, Typography, useTheme, Pagination } from '@mui/material';
import { StackRow, StackRowAlignCenter } from '~/components/elements/styles/stack.style';
import { FONT_SIZE, PADDING_GAP_LAYOUT } from '~/common/constant/style.constant';
import React, { useEffect, useMemo, useState } from 'react';
import ModalImage from '~/components/modal/modal-image/modal-image.element';
import { SliderProduct, SliderProductItems } from '~/components/elements/slider/slider.element';

import ProductChao from '~/assets/images/product-chao.png';
import ProductMien from '~/assets/images/product-mien.png';
import { useNavigate, useParams } from 'react-router-dom';
import { productApi, cartApi } from '~/apis';
import { ProductDetail } from '~/apis/product/product.interface.api';
import { PATH } from '~/router';
import { BoxContent } from '~/components/elements/forms/box/box-content';
import { FormatPrice } from '~/components/elements/format-price/format-price.element';
import { ShoppingCartOutlined } from '@mui/icons-material';
import { useSnackbar } from '~/hooks/use-snackbar/use-snackbar';
import { useLang } from '~/hooks/use-lang/use-lang';
import { getLangPrefix } from '~/common/constant/get-lang-prefix';
import { formatDateTime } from '~/common/until/date-format.until';

export default function ProductDetailPage() {
  const { palette } = useTheme();
  const { snackbar } = useSnackbar();
  const [open, setOpen] = React.useState(false);
  const { slug } = useParams<{ slug?: string }>();

  // Lấy lang từ hook
  const currentLang = useLang();
  const prefix = getLangPrefix(currentLang);

  const [productDetail, setProductDetail] = useState<ProductDetail | null>();
  const [qty, setQty] = useState(1);
  const [mainImage, setMainImage] = useState(productDetail?.product_images[0].image_url);
  const [modalSrc, setModalSrc] = useState('');
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | number>('all');
  const [commentPage, setCommentPage] = useState(1); 
  const COMMENTS_PER_PAGE = 2; // số comment mỗi trang
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApi = async () => {
      if (!slug) return;
      const result = await productApi.getDetailProduct(slug, currentLang);
      setProductDetail(result);
      if (result.product_translations[0].slug && result.product_translations[0].slug !== slug) {
        navigate(`${prefix}/${PATH.SITE_SCREEN.PRODUCT.ROOT}/${result.product_translations[0].slug}`, {
          replace: true,
        });
      }
    };
    fetchApi();
  }, [currentLang, slug, navigate, prefix]);

  useEffect(() => {
    if (productDetail?.product_images?.length) {
      setMainImage(productDetail.product_images[0].image_url);
    }
  }, [productDetail]);

  const handlePrev = () => {
    if (qty > 1) {
      setQty(qty - 1);
    }
  };

  const handlePlus = () => {
    setQty(qty + 1);
  };

  const handleAddToCart = async () => {
    if (!productDetail || !productDetail.id) return;
    setIsAddingToCart(true);
    try {
      const result = await cartApi.createCart({
        product_id: productDetail.id,
        qty: qty,
      });
      snackbar('success', result.message || 'Đã thêm sản phẩm vào giỏ hàng');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Không thể thêm vào giỏ hàng';
      snackbar('error', errorMessage);
    } finally {
      setIsAddingToCart(false);
    }
  };
  const items: SliderProductItems[] = [
    { src: ProductChao, title: 'Cháo bột cá lóc' },
    { src: ProductMien, title: 'Miến cá lóc' },
    { src: ProductChao, title: 'Cháo tôm' },
    { src: ProductMien, title: 'Cháo tôm thịt' },
    { src: ProductMien, title: 'Miến cá lóc' },
  ];

  const Rated = [
    { label: 'Tất cả', value: 'all' },
    { label: '5 sao', value: 5 },
    { label: '4 sao', value: 4 },
    { label: '3 sao', value: 3 },
    { label: '2 sao', value: 2 },
    { label: '1 sao', value: 1 },
  ];
  const filteredRate = useMemo(
    () =>
      activeFilter === 'all'
        ? productDetail?.reviews ?? []
        : (productDetail?.reviews ?? []).filter((o) => o.rating === Number(activeFilter)),
    [productDetail?.reviews, activeFilter],
  );
  console.log('filteredRate', filteredRate);
  const filterCounts = useMemo(() => {
    const ratedCount: Record<string | number, number> = { all: productDetail?.reviews?.length || 0 };
    Rated.forEach((rate) => {
      if (rate.value === 'all') return;
      const count = productDetail?.reviews?.filter((rev) => rev.rating === rate.value).length || 0;
      ratedCount[rate.value] = count;
    });
    return ratedCount;
  }, [productDetail?.reviews]);

  return (
    <Stack spacing={2} sx={{ backgroundColor: palette.background.default }}>
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
          {/*  */}
          <ModalImage open={open} onClose={() => setOpen(false)} src={modalSrc} alt="Sản phẩm" />\
          {/*  */}
        </Stack>
        <Stack sx={{ position: 'relative', top: '-40%', transform: 'translateY(50%)', gap: 1 }}>
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
              <Button onClick={handlePrev} disabled={qty === 1}>
                -
              </Button>
              <Button style={{ userSelect: 'text', cursor: 'text' }}>{qty}</Button>
              <Button onClick={handlePlus}>+</Button>
            </ButtonGroup>
          </StackRow>
          <StackRow gap={2} sx={{ paddingTop: 4 }}>
            <Button
              variant="outlined"
              startIcon={<ShoppingCartOutlined />}
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              sx={{
                color: palette.primary.main,
                borderColor: palette.primary.main,
                backgroundColor: palette.primary.light,
                textTransform: 'none',
                px: 3,
                py: 1,
                '&:hover': {
                  opacity: '0.9',
                },
              }}
            >
              {isAddingToCart ? 'Thêm Vào Giỏ Hàng' : 'Thêm Vào Giỏ Hàng'}
            </Button>

            {/* Nút Mua ngay */}
            <Button
              variant="contained"
              sx={{
                backgroundColor: palette.primary.main,
                color: palette.primary.light,
                textTransform: 'none',
                px: 4,
                py: 1,
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
      {filteredRate && filteredRate.length > 0 && (
        <Stack
          spacing={2}
          sx={{ borderRadius: PADDING_GAP_LAYOUT, boxShadow: '0 2px 8px rgba(0,0,0,0.2)', p: 3, flex: 1 }}
        >
          <Stack>
            <Typography variant="h2" sx={{ paddingBottom: PADDING_GAP_LAYOUT, color: palette.primary.main }}>
              Đánh giá sản phẩm
            </Typography>
            <StackRow>
              {Rated.map((rate) => {
                const active = activeFilter === rate.value;
                return (
                  <Box
                    key={rate.value}
                    onClick={() => setActiveFilter(rate.value)}
                    sx={{
                      px: 2,
                      py: 0.75,
                      cursor: 'pointer',
                      userSelect: 'none',
                      color: active ? 'primary.main' : 'text.primary',
                      border: active ? `1px solid ${palette.primary.main}` : '1px solid transparent',
                      position: 'relative',
                      '&:hover': { color: 'primary.main' },
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ minWidth: 80, textAlign: 'center' }}>
                      {rate.label}
                      {rate.value !== 'all' && <span> ({filterCounts[rate.value] ?? 0})</span>}
                    </Typography>
                  </Box>
                );
              })}
            </StackRow>
          </Stack>

          {filteredRate
            .slice((commentPage - 1) * COMMENTS_PER_PAGE, commentPage * COMMENTS_PER_PAGE)
            .map((rev, idx) => (
              <Stack spacing={1} key={idx}>
                <StackRowAlignCenter columnGap={1}>
                  <Avatar sx={{ width: 34, height: 34, bgcolor: palette.primary.main }}>
                    {rev.user_name.charAt(0).toUpperCase()}
                  </Avatar>
                  <Stack>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: palette.text.primary, paddingLeft: '4px', fontSize: '10px' }}
                    >
                      {rev.user_name}
                    </Typography>
                    <Rating name="read-only" size="small" value={rev.rating} readOnly />
                  </Stack>
                </StackRowAlignCenter>
                <Stack sx={{ paddingLeft: '38px' }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: palette.text.primary, paddingLeft: '4px', fontSize: '10px' }}
                  >
                    {formatDateTime(rev.created_at)}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: palette.text.primary, paddingLeft: '4px', fontSize: FONT_SIZE.small }}
                  >
                    {rev.comment}
                  </Typography>
                  {rev.images.length > 0 && (
                    <StackRow gap={1} sx={{ marginTop: '8px' }}>
                      {rev.images.map((img, imgIdx) => (
                        <Box
                          key={imgIdx}
                          component="img"
                          src={img}
                          alt={`review-${imgIdx}`}
                          sx={{
                            width: 80,
                            height: 80,
                            objectFit: 'cover',
                            cursor: 'pointer',
                            borderRadius: 1,
                            border: `1px solid ${palette.background.paper}`,
                          }}
                          onClick={() => {
                            setModalSrc(img);
                            setOpen(true);
                          }}
                        />
                      ))}
                    </StackRow>
                  )}
                </Stack>
              </Stack>
            ))}

          {Math.ceil(filteredRate.length / COMMENTS_PER_PAGE) > 1 && (
            <Pagination
              count={Math.ceil(filteredRate.length / COMMENTS_PER_PAGE)}
              page={commentPage}
              variant="outlined"
              onChange={(event, value) => setCommentPage(value)}
            />
          )}
        </Stack>
      )}
      <Typography variant="subtitle2" sx={{ padding: `${PADDING_GAP_LAYOUT} 0`, color: palette.primary.main }}>
        Sản phẩm tương tự
      </Typography>
      <SliderProduct items={items} />
    </Stack>
  );
}
