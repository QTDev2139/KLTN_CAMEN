import { Button, ButtonGroup, Grid, Stack, Typography, useTheme, Checkbox, FormControlLabel } from '@mui/material';
import { PADDING_GAP_LAYOUT } from '~/common/constant/style.constant';
import { StackRow } from '~/components/elements/styles/stack.style';
import { getLimitLineCss } from '~/common/until/get-limit-line-css';
import { useEffect, useRef, useState } from 'react';
import { FormatPrice } from '~/components/elements/format-price/format-price.element';
import { Cart } from '~/apis/cart/cart.api.interface';
import { cartApi } from '~/apis';
import { useParams } from 'react-router-dom';
import { useSnackbar } from '~/hooks/use-snackbar/use-snackbar';

const DEBOUNCE_MS = 500;

const CartPage: React.FC = () => {
  const { palette } = useTheme();
  const { snackbar } = useSnackbar();
  const { lang } = useParams<{ lang: 'vi' | 'en' }>();

  const [cart, setCart] = useState<Cart | null>(null);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [syncing, setSyncing] = useState<Set<number>>(new Set()); // Track syncing per item

  // Map<cart_item_id, timeoutId>
  const debounceTimers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  // Fetch cart data
  const fetchCart = async () => {
    try {
      const result = await cartApi.getCart(lang || 'vi');
      setCart(result);
    } catch (error) {
      console.error('Error fetching cart:', error);
      snackbar('error', 'Không thể tải giỏ hàng');
    }
  };

  useEffect(() => {
    fetchCart();
  }, [lang]);

  useEffect(() => {
    // cleanup khi unmount
    return () => {
      debounceTimers.current.forEach(clearTimeout);
      debounceTimers.current.clear();
    };
  }, []);

  // Derived values
  const cartItems = cart?.items || [];
  const allSelected = cartItems.length > 0 && selected.size === cartItems.length;
  const someSelected = selected.size > 0 && selected.size < cartItems.length;

  // Tổng tiền các item được chọn
  const totalSelected = cartItems
    .filter((item) => selected.has(item.id))
    .reduce((sum, item) => sum + parseFloat(item.subtotal), 0);

  // Toggle single item
  const toggleOne = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Toggle all items
  const toggleAll = (checked: boolean) => {
    if (checked) setSelected(new Set(cartItems.map((i) => i.id)));
    else setSelected(new Set());
  };

  // Optimistic update qty + subtotal trên UI
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

  // Lên lịch sync API theo từng item sau 500ms
  const scheduleSync = (itemId: number, nextQty: number) => {
    // 1) Update UI ngay
    updateQtyOptimistic(itemId, nextQty);

    // 2) Reset timer cũ (nếu có)
    const old = debounceTimers.current.get(itemId);
    if (old) clearTimeout(old);

    // 3) Đặt lại timer
    const t = setTimeout(async () => {
      try {
        setSyncing((prev) => new Set(prev).add(itemId));
        await cartApi.updateCart(itemId, nextQty);
        await fetchCart(); // đồng bộ lại dữ liệu chuẩn từ BE
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

  // Giảm số lượng (debounce)
  const handlePrev = (id: number) => {
    if (syncing.has(id)) return; // Prevent if already syncing
    const item = cartItems.find((i) => i.id === id);
    if (!item || item.qty <= 1) return;
    scheduleSync(id, item.qty - 1);
  };

  // Tăng số lượng (debounce)
  const handlePlus = (id: number) => {
    if (syncing.has(id)) return; // Prevent if already syncing
    const item = cartItems.find((i) => i.id === id);
    if (!item) return;
    scheduleSync(id, item.qty + 1);
  };

  // Remove single item
  const removeOne = async (itemId: number) => {
    if (syncing.has(itemId)) return;
    if (!window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;
    
    try {
      setSyncing((prev) => new Set(prev).add(itemId));
      await cartApi.deleteCart(itemId);
      await fetchCart();
      setSelected(prev => { 
        const s = new Set(prev); 
        s.delete(itemId); 
        return s; 
      });
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

  // Remove selected items
  const removeSelected = async () => {
    if (selected.size === 0) return;
    if (syncing.size > 0) return; // Prevent if any item is syncing
    if (!window.confirm(`Bạn có chắc muốn xóa ${selected.size} sản phẩm?`)) return;
    
    try {
      // Add all selected to syncing
      setSyncing(new Set(selected));
      
      await Promise.all(Array.from(selected).map((id) => cartApi.deleteCart(id)));
      await fetchCart();
      setSelected(new Set());
      snackbar('success', 'Đã xóa các sản phẩm đã chọn');
    } catch (error: any) {
      snackbar('error', error?.response?.data?.message || 'Không thể xóa sản phẩm');
    } finally {
      setSyncing(new Set());
    }
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
        <Grid size={{ md: 6 }}>Sản phẩm</Grid>
        <Grid size={{ md: 1 }}>Đơn giá</Grid>
        <Grid size={{ md: 2 }}>Số lượng</Grid>
        <Grid size={{ md: 1 }}>Số tiền</Grid>
        <Grid size={{ md: 2 }}>Thao tác</Grid>
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
                <Grid size={{ md: 6 }}>
                  <StackRow>
                    <Checkbox
                      checked={selected.has(item.id)}
                      onChange={() => toggleOne(item.id)}
                      disabled={isItemSyncing}
                      inputProps={{ 'aria-label': `Chọn ${item.product_name}` }}
                      sx={{
                        '&:hover': { backgroundColor: 'transparent' },
                        '&.Mui-checked:hover': { backgroundColor: 'transparent' },
                      }}
                    />
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
                      <Button 
                        onClick={() => handlePrev(item.id)} 
                        disabled={item.qty === 1 || isItemSyncing}
                      >
                        -
                      </Button>
                      <Button style={{ userSelect: 'text', cursor: 'text' }}>{item.qty}</Button>
                      <Button 
                        onClick={() => handlePlus(item.id)}
                        disabled={isItemSyncing}
                      >
                        +
                      </Button>
                    </ButtonGroup>
                  </StackRow>
                </Grid>

                <Grid size={{ md: 1 }}>
                  <Typography variant="subtitle1">{FormatPrice(parseFloat(item.subtotal))}</Typography>
                </Grid>

                <Grid size={{ md: 2 }}>
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
            justifyContent: 'center',
            alignItems: 'center',
            position: 'sticky',
            bottom: 0,
            boxShadow: '0 -6px 16px rgba(0,0,0,0.06)',
          }}
        >
          <Grid size={{ md: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  indeterminate={someSelected}
                  checked={allSelected}
                  onChange={(e) => toggleAll(e.target.checked)}
                  disabled={syncing.size > 0}
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
                color: selected.size && syncing.size === 0 ? palette.primary.main : palette.text.disabled,
                cursor: selected.size && syncing.size === 0 ? 'pointer' : 'default',
                pointerEvents: syncing.size > 0 ? 'none' : 'auto',
              }}
              onClick={selected.size && syncing.size === 0 ? removeSelected : undefined}
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
            <Button variant="outlined" disabled={selected.size === 0 || syncing.size > 0}>
              Mua Hàng
            </Button>
          </Grid>
        </Grid>
      )}
    </Stack>
  );
};

export default CartPage;
