import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
  useTheme,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Grid,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Check as CheckIcon } from '@mui/icons-material';
import { PADDING_GAP_LAYOUT } from '~/common/constant/style.constant';
import { FormatPrice } from '~/components/elements/format-price/format-price.element';
import { useSnackbar } from '~/hooks/use-snackbar/use-snackbar';
import { orderApi } from '~/apis';
import { OrderItem } from '~/apis/order/order.api.interface';
import Autocomplete from '@mui/material/Autocomplete';
import { vnAddressApi, Province, Ward } from '~/apis/vn-address/vn-address.api';

const OrderPage: React.FC = () => {
  const { palette } = useTheme();
  const { snackbar } = useSnackbar();
  const navigate = useNavigate();
  const { lang } = useParams<{ lang?: string }>();
  const location = useLocation();
  const currentLang = (lang || 'vi') as 'vi' | 'en';

  // Nhận data từ cart page
  const orderData = location.state as {
    items: OrderItem[];
    totalAmount: number;
  } | null;

  const [items, setItems] = useState<OrderItem[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Coupon/Discount states
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isCouponApplied, setIsCouponApplied] = useState(false);

  // Customer info
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('male');

  // Address states (theo API v2: province -> wards)
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [province, setProvince] = useState<Province | null>(null);
  const [ward, setWard] = useState<Ward | null>(null);
  const [street, setStreet] = useState('');

  // Load danh sách tỉnh
  useEffect(() => {
    (async () => {
      try {
        const list = await vnAddressApi.getProvinces();
        setProvinces(list);
      } catch {
        snackbar('error', 'Không tải được danh sách tỉnh/thành');
      }
    })();
  }, []);

  // Load phường/xã khi chọn tỉnh
  useEffect(() => {
    if (!province) {
      setWards([]);
      setWard(null);
      return;
    }
    (async () => {
      try {
        const result = await vnAddressApi.getWardsByProvince(province.code);
        setWards(result);
        setWard(null);
      } catch {
        snackbar('error', 'Không tải được phường/xã');
      }
    })();
  }, [province]);

  // Nhận data từ Cart
  useEffect(() => {
    if (!orderData || !orderData.items || orderData.items.length === 0) {
      snackbar('error', 'Không có sản phẩm nào được chọn');
      navigate(currentLang === 'en' ? '/en/cart' : '/cart');
      return;
    }
    setItems(orderData.items);
    setTotalAmount(orderData.totalAmount);
  }, [orderData, currentLang, navigate, snackbar]);

  // Apply coupon
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      snackbar('error', 'Vui lòng nhập mã giảm giá');
      return;
    }

    try {
      // TODO: Gọi API kiểm tra mã giảm giá
      // const result = await couponApi.validateCoupon(couponCode);
      // setDiscount(result.discount_amount);
      
      // Mock: giả sử mã giảm 10%
      const discountAmount = totalAmount * 0.1;
      setDiscount(discountAmount);
      setIsCouponApplied(true);
      snackbar('success', `Áp dụng mã giảm giá thành công! Giảm ${FormatPrice(discountAmount)}`);
    } catch (error: any) {
      snackbar('error', error?.response?.data?.message || 'Mã giảm giá không hợp lệ');
    }
  };

  const finalAmount = totalAmount - discount;

  const handleSubmitOrder = async () => {
    // Validate customer info
    if (!customerName.trim() || !phone.trim()) {
      snackbar('error', 'Vui lòng nhập đầy đủ thông tin khách hàng');
      return;
    }

    // Validate address
    if (!province || !ward || !street.trim()) {
      snackbar('error', 'Vui lòng nhập đầy đủ địa chỉ giao hàng');
      return;
    }

    const fullAddress = [street, ward.name, province.name].join(', ');

    setIsSubmitting(true);
    try {
      const result = await orderApi.createOrder({
        items,
        total_amount: finalAmount,
        shipping_address: fullAddress,
        payment_method: paymentMethod,
        note,
        // coupon_code: isCouponApplied ? couponCode : undefined,
        // discount_amount: discount,
      });

      snackbar('success', 'Đặt hàng thành công!');
      navigate(currentLang === 'en' ? `/en/order/${result.id}` : `/order/${result.id}`);
    } catch (error: any) {
      snackbar('error', error?.response?.data?.message || 'Đặt hàng thất bại');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!orderData) return null;

  return (
    <Container maxWidth="lg" sx={{ py: PADDING_GAP_LAYOUT }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        Đặt hàng
      </Typography>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        {/* Left: Items + Shipping */}
        <Paper sx={{ p: 3, flex: 1 }}>
          {/* Customer Info */}
          <Typography variant="h6" sx={{ mb: 2, fontSize: 20, fontWeight: 600 }}>
            Thông tin khách hàng
          </Typography>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="male"
            name="radio-buttons-group"
            sx={{ display: 'flex', flexDirection: 'row' }}
          >
            <FormControlLabel value="male" control={<Radio />} label="Anh" />
            <FormControlLabel value="female" control={<Radio />} label="Chị" />
          </RadioGroup>

          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Tên khách hàng"
              placeholder="Ví dụ: Nguyễn Văn A"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
            
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Số điện thoại"
                  placeholder="Ví dụ: 0123456789"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Email"
                  placeholder="Ví dụ: camenfood@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6, lg: 6 }}>
                {/* Tỉnh/Thành */}
                <Autocomplete
                  options={provinces}
                  value={province}
                  getOptionLabel={(o) => o?.name ?? ''}
                  onChange={(_, v) => setProvince(v)}
                  renderInput={(params) => <TextField {...params} label="Tỉnh/Thành phố" required />}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6, lg: 6 }}>
                {/* Phường/Xã */}
                <Autocomplete
                  options={wards}
                  value={ward}
                  getOptionLabel={(o) => o?.name ?? ''}
                  onChange={(_, v) => setWard(v)}
                  renderInput={(params) => <TextField {...params} label="Phường/Xã" required />}
                  disabled={!province}
                />
              </Grid>
            </Grid>

            <TextField
              fullWidth
              label="Số nhà, đường"
              placeholder="Ví dụ: 123 Lê Lợi"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              required
            />

            <Divider sx={{ my: 2 }} />

            <TextField
              fullWidth
              label="Ghi chú"
              placeholder="Ghi chú cho đơn hàng (tùy chọn)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              multiline
              rows={3}
            />
            {/* Phương thức thanh toán */}
            <FormControl>
              <FormLabel>Phương thức thanh toán</FormLabel>
              <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <FormControlLabel value="cod" control={<Radio />} label="Thanh toán khi nhận hàng (COD)" />
                <FormControlLabel value="bank" control={<Radio />} label="Chuyển khoản ngân hàng" />
                <FormControlLabel value="momo" control={<Radio />} label="Ví MoMo" />
              </RadioGroup>
            </FormControl>
          </Stack>
        </Paper>

        {/* Right: Summary */}
        <Paper sx={{ p: 3, width: { md: 380, xs: '100%' }, flexShrink: 0, position: 'sticky', top: 20 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Tóm tắt đơn hàng
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {items.map((item) => (
            <Stack key={item.product_id} direction="row" spacing={2} sx={{ mb: 2, alignItems: 'center' }}>
              <img
                src={item.product_image}
                alt={item.product_name}
                style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }}
              />
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1">{item.product_name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Số lượng: {item.qty}
                </Typography>
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {FormatPrice(parseFloat(item.subtotal))}
              </Typography>
            </Stack>
          ))}

          <Divider sx={{ my: 2 }} />

          {/* Coupon Input */}
          <TextField
            fullWidth
            label="Mã giảm giá"
            placeholder="Nhập mã giảm giá"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            disabled={isCouponApplied}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleApplyCoupon}
                    disabled={isCouponApplied}
                    color={isCouponApplied ? 'success' : 'primary'}
                  >
                    {isCouponApplied ? <CheckIcon /> : <Typography variant="caption">Áp dụng</Typography>}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          <Stack spacing={1.5}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Tạm tính
              </Typography>
              <Typography variant="body2">{FormatPrice(totalAmount)}</Typography>
            </Stack>

            {discount > 0 && (
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="success.main">
                  Giảm giá
                </Typography>
                <Typography variant="body2" color="success.main">
                  -{FormatPrice(discount)}
                </Typography>
              </Stack>
            )}

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Phí vận chuyển
              </Typography>
              <Typography variant="body2">Thanh toán khi nhận hàng</Typography>
            </Stack>

            <Divider />

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Tổng cộng
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, color: palette.primary.main }}>
                {FormatPrice(finalAmount)}
              </Typography>
            </Stack>
          </Stack>

          <Button
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3 }}
            onClick={handleSubmitOrder}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Đặt hàng' : 'Đặt hàng'}
          </Button>

          <Button
            fullWidth
            variant="outlined"
            sx={{ mt: 2 }}
            onClick={() => navigate('/vi/cart')}
            disabled={isSubmitting}
          >
            Quay lại giỏ hàng
          </Button>
        </Paper>
      </Stack>
    </Container>
  );
};

export default OrderPage;
