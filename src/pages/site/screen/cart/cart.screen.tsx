import { Button, ButtonGroup, Grid, Stack, Typography, useTheme, Checkbox, FormControlLabel } from '@mui/material'; // thêm Checkbox, FormControlLabel
import { PADDING_GAP_LAYOUT } from '~/common/constant/style.constant';
import { StackRow } from '~/components/elements/styles/stack.style';
import ProductChao from '~/assets/images/product-chao.png';
import ProductMien from '~/assets/images/product-mien.png';
import { getLimitLineCss } from '~/common/until/get-limit-line-css';
import { useState } from 'react';

type CartItem = {
  id: string;
  title: string;
  price: number;
  img: string;
  qty: number;
};

export const FormatPrice = (number: number) => {
  return number.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};

const CartPage: React.FC = () => {
  const { palette } = useTheme();
  const [items, setItems] = useState<CartItem[]>([
    { id: 'chao', title: 'Cháo bột bánh canh cá lóc gói (250g)', price: 360000, img: ProductChao, qty: 1 },
    { id: 'mien', title: 'Mì/miến gì đó (250g)', price: 220000, img: ProductMien, qty: 2 },
    { id: 'chao1', title: 'Cháo bột bánh canh cá lóc gói (250g)', price: 360000, img: ProductChao, qty: 1 },
    { id: 'mien1', title: 'Mì/miến gì đó (250g)', price: 220000, img: ProductMien, qty: 2 },
    { id: 'chao2', title: 'Cháo bột bánh canh cá lóc gói (250g)', price: 360000, img: ProductChao, qty: 1 },
    { id: 'mien3', title: 'Mì/miến gì đó (250g)', price: 220000, img: ProductMien, qty: 2 },
  ]);

  // quản lý id các sản phẩm được chọn
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const handlePrev = (id: string) =>
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, qty: it.qty - 1 } : it)));
  const handlePlus = (id: string) =>
    setItems((plus) => plus.map((it) => (it.id === id ? { ...it, qty: it.qty + 1 } : it)));

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  //chọn/bỏ chọn tất cả
  const allSelected = items.length > 0 && selected.size === items.length;
  const someSelected = selected.size > 0 && !allSelected;
  const toggleAll = (checked: boolean) => {
    setSelected(checked ? new Set(items.map((i) => i.id)) : new Set());
  };

  // xóa 1 item & xóa những item đã chọn
  const removeOne = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
    setSelected((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };
  const removeSelected = () => {
    if (selected.size === 0) return;
    setItems((prev) => prev.filter((it) => !selected.has(it.id)));
    setSelected(new Set());
  };

  // tổng tiền của các sản phẩm đang được chọn
  const totalSelected = items.reduce((acc, item) => {
    return selected.has(item.id) ? acc + item.price * item.qty : acc;
  }, 0);

  return (
    <Stack spacing={2} sx={{ paddingTop: PADDING_GAP_LAYOUT }}>
      <Grid container spacing={2} sx={{ backgroundColor: palette.background.default, padding: PADDING_GAP_LAYOUT,  borderBottom: `1px solid ${palette.background.paper}` }}>
        <Grid size={{ md: 6 }}>Sản phẩm</Grid>
        <Grid size={{ md: 1 }}>Đơn giá</Grid>
        <Grid size={{ md: 2 }}>Số lượng</Grid>
        <Grid size={{ md: 1 }}>Số tiền</Grid>
        <Grid size={{ md: 2 }}>Thao tác</Grid>
      </Grid>

      {items.map((item, idx) => (
        <Stack spacing={2} sx={{ backgroundColor: palette.background.default, padding: PADDING_GAP_LAYOUT, borderBottom: `1px solid ${palette.background.paper}` }}>
          <Grid container spacing={2} key={idx} sx={{ alignItems: 'center' }}>
            <Grid size={{ md: 6 }}>
              <StackRow>
                <Checkbox
                  checked={selected.has(item.id)}
                  onChange={() => toggleOne(item.id)}
                  inputProps={{ 'aria-label': `Chọn ${item.title}` }}
                  sx={{
                    '&:hover': { backgroundColor: 'transparent' },
                    '&.Mui-checked:hover': { backgroundColor: 'transparent' },
                  }}
                />
                <img
                  src={ProductChao}
                  alt=""
                  style={{ width: '80px', height: '80px', marginRight: PADDING_GAP_LAYOUT }}
                />
                <Typography sx={{ ...getLimitLineCss(2) }} variant="subtitle1">
                  {item.title}
                </Typography>
              </StackRow>
            </Grid>

            <Grid size={{ md: 1 }}>
              <Typography variant="subtitle1">{FormatPrice(item.price)}</Typography>
            </Grid>

            <Grid size={{ md: 2 }}>
              <StackRow>
                <ButtonGroup variant="outlined" color="inherit" size="small" sx={{ color: palette.text.primary }}>
                  {/* disable khi qty = 1 để không giảm xuống 0 */}
                  <Button onClick={() => handlePrev(item.id)} disabled={item.qty === 1}>
                    -
                  </Button>
                  <Button style={{ userSelect: 'text', cursor: 'text' }}>{item.qty}</Button>
                  <Button onClick={() => handlePlus(item.id)}>+</Button>
                </ButtonGroup>
              </StackRow>
            </Grid>

            <Grid size={{ md: 1 }}>
              <Typography variant="subtitle1">{FormatPrice(item.qty * item.price)}</Typography>
            </Grid>

            <Grid size={{ md: 2 }}>
              <Typography
                variant="subtitle1"
                sx={{ color: palette.primary.main, cursor: 'pointer' }}
                onClick={() => removeOne(item.id)} // xóa 1 dòng
              >
                Xóa
              </Typography>
            </Grid>
          </Grid>
        </Stack>
      ))}

      <Grid
        container
        spacing={2}
        sx={{
          backgroundColor: palette.background.default,
          padding: PADDING_GAP_LAYOUT,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'sticky',
          bottom: 0,
          boxShadow: '0 -6px 16px rgba(0,0,0,0.06)',
        }}
      >
        <Grid size={{ md: 2 }}>
          {/* chọn tất cả với trạng thái indeterminate */}
          <FormControlLabel
            control={
              <Checkbox
                indeterminate={someSelected}
                checked={allSelected}
                onChange={(e) => toggleAll(e.target.checked)}
                inputProps={{ 'aria-label': 'Chọn tất cả' }}
              />
            }
            label="Chọn tất cả"
          />
        </Grid>

        <Grid size={{ md: 6 }}>
          <Typography
            variant="subtitle1"
            sx={{
              color: selected.size ? palette.primary.main : palette.text.disabled,
              cursor: selected.size ? 'pointer' : 'default',
            }}
            onClick={removeSelected} // xóa các mục đã chọn
          >
            Xóa
          </Typography>
        </Grid>

        <Grid size={{ md: 2 }}>
          <Typography variant="body2" sx={{ color: palette.text.secondary }}>
            Tổng cộng ({selected.size}): {FormatPrice(totalSelected)}
          </Typography>
        </Grid>

        <Grid size={{ md: 2 }}>
          <Button variant="outlined" disabled={selected.size === 0 /* có thể yêu cầu chọn sp trước */}>
            Mua Hàng
          </Button>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default CartPage;
