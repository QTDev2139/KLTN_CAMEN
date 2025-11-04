import { Button, ButtonGroup, Grid, Stack, Typography, useTheme } from '@mui/material';
import { PADDING_GAP_LAYOUT } from '~/common/constant/style.constant';
import { StackRow } from '~/components/elements/styles/stack.style';
import { getLimitLineCss } from '~/common/until/get-limit-line-css';
import { useEffect, useRef, useState } from 'react';
import { FormatPrice } from '~/components/elements/format-price/format-price.element';
import { Cart } from '~/apis/cart/cart.api.interface';
import { cartApi } from '~/apis';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '~/hooks/use-snackbar/use-snackbar';
import { useLang } from '~/hooks/use-lang/use-lang';
import { getLangPrefix } from '~/common/constant/get-lang-prefix';
import { AxiosError } from 'axios';

const DEBOUNCE_MS = 500;

const CartPage: React.FC = () => {
  const { palette } = useTheme();
  const { snackbar } = useSnackbar();
  const navigate = useNavigate();

  // Lấy lang từ hook thay vì useParams
  const currentLang = useLang();
  const prefix = getLangPrefix(currentLang);

  const [cart, setCart] = useState<Cart | null>(null);
  const [syncing, setSyncing] = useState<Set<number>>(new Set());

  const debounceTimers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const fetchCart = async () => {
    try {
      const result = await cartApi.getCart(currentLang);
      setCart(result);
    } catch (err) {
      const e = err as AxiosError<{ message?: string }>;
      const msg = e.response?.data?.message ?? e.message ?? 'Không thể tải giỏ hàng';
      snackbar('error', msg);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [currentLang]);

  useEffect(() => {
    return () => {
      debounceTimers.current.forEach(clearTimeout);
      debounceTimers.current.clear();
    };
  }, []);

  const cartItems = cart?.items || [];
  const totalAmount = cartItems.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);

  const updateQtyOptimistic = (itemId: number, nextQty: number) => {
    setCart((prev) => {
      if (!prev) return prev;
      const items = prev.items.map((it) => {
        if (it.id !== itemId) return it;
        const unit = parseFloat(it.unit_price);
        const subtotal = (unit * nextQty).toFixed(2);
        return { ...it, qty: nextQty, subtotal };
      });
      return { ...prev, items };
    });
  };

  const scheduleSync = (itemId: number, nextQty: number) => {
    updateQtyOptimistic(itemId, nextQty);

    const old = debounceTimers.current.get(itemId);
    if (old) clearTimeout(old);

    const t = setTimeout(async () => {
      try {
        setSyncing((prev) => new Set(prev).add(itemId));
        await cartApi.updateCart(itemId, nextQty);
        await fetchCart();
      } catch (error: any) {
        snackbar('error', error?.response?.data?.message || 'Không thể cập nhật số lượng');
        await fetchCart();
      } finally {
        setSyncing((prev) => {
          const next = new Set(prev);
          next.delete(itemId);
          return next;
        });
        debounceTimers.current.delete(itemId);
      }
    }, DEBOUNCE_MS);

    debounceTimers.current.set(itemId, t);
  };

  const handlePrev = (id: number) => {
    if (syncing.has(id)) return;
    const item = cartItems.find((i) => i.id === id);
    if (!item || item.qty <= 1) return;
    scheduleSync(id, item.qty - 1);
  };

  const handlePlus = (id: number) => {
    if (syncing.has(id)) return;
    const item = cartItems.find((i) => i.id === id);
    if (!item) return;
    scheduleSync(id, item.qty + 1);
  };

  const removeOne = async (itemId: number) => {
    if (syncing.has(itemId)) return;
    if (!window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;

    try {
      setSyncing((prev) => new Set(prev).add(itemId));
      await cartApi.deleteCart(itemId);
      await fetchCart();
      snackbar('success', 'Xóa sản phẩm thành công');
    } catch (error: any) {
      snackbar('error', error?.response?.data?.message || 'Không thể xóa sản phẩm');
    } finally {
      setSyncing((prev) => {
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      snackbar('error', 'Giỏ hàng trống');
      return;
    }

    if (syncing.size > 0) {
      snackbar('warning', 'Vui lòng đợi cập nhật giỏ hàng hoàn tất');
      return;
    }

    navigate(`${prefix}/order`, {
      state: {
        items: cartItems,
        totalAmount: totalAmount,
      },
    });
  };

  return (
    <Stack spacing={2} sx={{ paddingTop: PADDING_GAP_LAYOUT }}>
      {/* Header */}
      <Grid
        container
        spacing={2}
        sx={{
          backgroundColor: palette.background.default,
          padding: PADDING_GAP_LAYOUT,
          borderBottom: `1px solid ${palette.background.paper}`,
        }}
      >
        <Grid size={{ md: 7 }}>Sản phẩm</Grid>
        <Grid size={{ md: 1 }}>Đơn giá</Grid>
        <Grid size={{ md: 2 }}>Số lượng</Grid>
        <Grid size={{ md: 1 }}>Số tiền</Grid>
        <Grid size={{ md: 1 }}>Thao tác</Grid>
      </Grid>

      {/* Cart Items */}
      {cartItems.length === 0 ? (
        <Stack
          sx={{
            backgroundColor: palette.background.default,
            padding: PADDING_GAP_LAYOUT,
            textAlign: 'center',
          }}
        >
          <Typography variant="h6" color="text.secondary">
            Giỏ hàng trống
          </Typography>
        </Stack>
      ) : (
        cartItems.map((item) => {
          const isItemSyncing = syncing.has(item.id);

          return (
            <Stack
              key={item.id}
              spacing={2}
              sx={{
                backgroundColor: palette.background.default,
                padding: PADDING_GAP_LAYOUT,
                borderBottom: `1px solid ${palette.background.paper}`,
                opacity: isItemSyncing ? 0.6 : 1,
                transition: 'opacity 0.2s',
              }}
            >
              <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                <Grid size={{ md: 7 }}>
                  <StackRow>
                    <img
                      src={item.product_image}
                      alt={item.product_name}
                      style={{ width: '80px', height: '80px', marginRight: PADDING_GAP_LAYOUT, objectFit: 'cover' }}
                    />
                    <Typography sx={{ ...getLimitLineCss(2) }} variant="subtitle1">
                      {item.product_name}
                    </Typography>
                  </StackRow>
                </Grid>

                <Grid size={{ md: 1 }}>
                  <Typography variant="subtitle1">{FormatPrice(parseFloat(item.unit_price))}</Typography>
                </Grid>

                <Grid size={{ md: 2 }}>
                  <StackRow>
                    <ButtonGroup variant="outlined" color="inherit" size="small" sx={{ color: palette.text.primary }}>
                      <Button onClick={() => handlePrev(item.id)} disabled={item.qty === 1 || isItemSyncing}>
                        -
                      </Button>
                      <Button style={{ userSelect: 'text', cursor: 'text' }}>{item.qty}</Button>
                      <Button onClick={() => handlePlus(item.id)} disabled={isItemSyncing}>
                        +
                      </Button>
                    </ButtonGroup>
                  </StackRow>
                </Grid>

                <Grid size={{ md: 1 }}>
                  <Typography variant="subtitle1">{FormatPrice(parseFloat(item.subtotal))}</Typography>
                </Grid>

                <Grid size={{ md: 1 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: isItemSyncing ? palette.text.disabled : palette.primary.main,
                      cursor: isItemSyncing ? 'default' : 'pointer',
                      pointerEvents: isItemSyncing ? 'none' : 'auto',
                    }}
                    onClick={() => removeOne(item.id)}
                  >
                    Xóa
                  </Typography>
                </Grid>
              </Grid>
            </Stack>
          );
        })
      )}

      {/* Footer */}
      {cartItems.length > 0 && (
        <Grid
          container
          spacing={2}
          sx={{
            backgroundColor: palette.background.default,
            padding: PADDING_GAP_LAYOUT,
            justifyContent: 'flex-end',
            alignItems: 'center',
            position: 'sticky',
            bottom: 0,
            boxShadow: '0 -6px 16px rgba(0,0,0,0.06)',
          }}
        >
          <Grid size={{ md: 2 }}>
            <Typography variant="body2" sx={{ color: palette.text.secondary }}>
              Tổng cộng: {FormatPrice(totalAmount)}
            </Typography>
          </Grid>

          <Grid size={{ md: 2 }}>
            <Button variant="contained" disabled={syncing.size > 0} fullWidth onClick={handleCheckout}>
              Mua Hàng
            </Button>
          </Grid>
        </Grid>
      )}
    </Stack>
  );
};

export default CartPage;
