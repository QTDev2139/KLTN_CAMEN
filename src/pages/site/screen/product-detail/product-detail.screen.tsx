import { Box, Stack, Typography, useTheme } from '@mui/material';
import { BoxForm } from '~/components/elements/forms/box/box-form';
import { StackRow } from '~/components/elements/styles/stack.style';
import ProductImg from '~/assets/images/product-mien.png';
import { BORDER_RADIUS_ELEMENT_WRAPPER } from '~/common/constant/style.constant';
import React from 'react';
import ModalImage from '~/components/elements/modal-image/modal-image.element';
import { SpeciaList } from '~/components/elements/specia-list/specia-list.element';
import { SliderProduct, SliderProductItems } from '~/components/elements/slider/slider.element';

import ProductChao from '~/assets/images/product-chao.png';
import ProductMien from '~/assets/images/product-mien.png';

export default function ProductDetailPage() {
  const { palette } = useTheme();

  const [open, setOpen] = React.useState(false);

  const items: SliderProductItems[] = [
    {src: ProductChao ,title: 'Cháo bột cá lóc' },
    {src: ProductMien ,title: 'Miến cá lóc' },
    {src: ProductChao ,title: 'Cháo tôm' },
    {src: ProductMien ,title: 'Cháo tôm thịt' },
    {src: ProductMien ,title: 'Miến cá lóc' },
  ]

  return (
    <Stack>
      <StackRow sx={{ display: 'grid', gridTemplateColumns: '5fr 7fr', gap: 4, marginBottom: '40px' }}>
        <Stack>
          <BoxForm sx={{ minHeight: 'auto' }}>
            <Box sx={{ padding: '10px 0' }} onClick={() => setOpen(true)}>
              <img src={ProductImg} alt="Sản phẩm" style={{ display: 'block', maxWidth: '100%' }} />
            </Box>
          </BoxForm>
          <Box
            sx={{
              maxWidth: '60px',
              maxHeight: '160px',
              border: `2px solid ${palette.primary.main}`,
              borderRadius: BORDER_RADIUS_ELEMENT_WRAPPER,
              padding: '8px 12px',
              margin: '20px auto',
            }}
          >
            <img src={ProductImg} alt="Sản phẩm" style={{ display: 'block', maxWidth: '100%' }} />
          </Box>
          <ModalImage open={open} onClose={() => setOpen(false)} src={ProductImg} alt="Sản phẩm" />
        </Stack>
        <Stack>
          <Typography variant="h2" sx={{ paddingBottom: '16px' }}>
            Miến Lươn
          </Typography>
          <SpeciaList label="Bar code" value="8 96294308 092843" />
          <SpeciaList label="Khối lượng tịnh" value="70g" />
          <SpeciaList label="Hạn sử dụng" value="12 tháng kể từ ngày sản xuất" />
        </Stack>
      </StackRow>
      <BoxForm sx={{ minHeight: 'auto' }}>
        <Stack sx={{ alignItems: 'start' }}>
          <Typography variant="h2" sx={{ paddingBottom: '16px', color: palette.primary.main }}>
            Mô tả sản phẩm
          </Typography>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            Vắt mì
          </Typography>
          <Typography variant="subtitle2">
            Bột mì, dầu cọ, tinh bột khoai mì, muối, chất điều vị (621, 627, 631), chất điều chỉnh độ acid (451(i),
            500(i)), nghệ, chất chống oxy hóa (320, 321).
          </Typography>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            Các gói gia vị
          </Typography>
          <Typography variant="subtitle2">
            Đường, dầu cọ, chất điều vị (621, 627, 631, 364(ii)), bột kem, gia vị (ớt, tỏi, sả, hành, riềng), muối, bột
            tôm (2,88 g/kg), bột hải sản, chất điều chỉnh độ acid (296, 330), hương liệu giống tự nhiên (hương Tom Yum),
            chất ổn định (340(ii), 452(i)), chất làm dày (412), chất tạo màu tự nhiên (160c(i)), chất nhũ hóa (1450,
            471), chất chống đông vón (551), chất chống oxy hóa (320, 321), chất tạo màu tổng hợp (160a(i)), lá chanh.
          </Typography>
        </Stack>
      </BoxForm>
      <StackRow>
        <BoxForm sx={{ minHeight: 'auto', display: 'block' }}>
          <Stack sx={{ alignItems: 'start' }}>
            <Typography variant="h2" sx={{ paddingBottom: '16px', color: palette.primary.main }}>
              Mô tả sản phẩm
            </Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              Vắt mì
            </Typography>
            <Typography variant="subtitle2">
              Bột mì, dầu cọ, tinh bột khoai mì, muối, chất điều vị (621, 627, 631), chất điều chỉnh độ acid (451(i),
              500(i)), nghệ, chất chống oxy hóa (320, 321).
            </Typography>
            <Typography variant="subtitle2">
              Bột mì, dầu cọ, tinh bột khoai mì, muối, chất điều vị (621, 627, 631), chất điều chỉnh độ acid (451(i),
              500(i)), nghệ, chất chống oxy hóa (320, 321).
            </Typography>
            <Typography variant="subtitle2">
              Bột mì, dầu cọ, tinh bột khoai mì, muối, chất điều vị (621, 627, 631), chất điều chỉnh độ acid (451(i),
              500(i)), nghệ, chất chống oxy hóa (320, 321).
            </Typography>
          </Stack>
        </BoxForm>
        <Stack>
          <BoxForm sx={{ minHeight: 'auto' }}>
            <Stack sx={{ alignItems: 'start' }}>
              <Typography variant="h2" sx={{ paddingBottom: '16px', color: palette.primary.main }}>
                Thông Tin Cảnh Báo
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Sản phẩm này có chứa bột mì, tôm, mực, lúa mạch, đậu nành, sữa, cá.
              </Typography>
            </Stack>
          </BoxForm>
          <BoxForm sx={{ minHeight: 'auto' }}>
            <Stack sx={{ alignItems: 'start' }}>
              <Typography variant="h2" sx={{ paddingBottom: '16px', color: palette.primary.main }}>
                Hướng Dẫn Sử Dụng
              </Typography>
              <Typography variant="subtitle2">1. Cho vắt mì vào 400ml nước sôi. Nấu trong 5 phút.</Typography>
              <Typography variant="subtitle2">2. Chắt nước (giữ lại 1 muỗng nước).</Typography>
              <Typography variant="subtitle2">3. Thêm các gói gia vị, trộn đều và dùng ngay.</Typography>
            </Stack>
          </BoxForm>
        </Stack>
      </StackRow>
      <Typography variant="h2" sx={{ paddingBottom: '16px', color: palette.primary.main }}>
        Sản phẩm tương tự
      </Typography>
      <SliderProduct items={items} />
    </Stack>
  );
}
