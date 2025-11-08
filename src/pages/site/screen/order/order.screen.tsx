import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  Chip,
  Autocomplete,
} from '@mui/material';
import { LocalOffer as CouponIcon, Phone } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { PADDING_GAP_LAYOUT } from '~/common/constant/style.constant';
import { FormatPrice } from '~/components/elements/format-price/format-price.element';
import { useSnackbar } from '~/hooks/use-snackbar/use-snackbar';
import { orderApi, couponApi, userApi, paymentApi } from '~/apis';
import { OrderItem } from '~/apis/order/order.interface.api';
import { Coupon } from '~/apis/coupon/coupon.interface.api';
import { vnAddressApi, Province, Ward } from '~/apis/vn-address/vn-address.api';
import { useLang } from '~/hooks/use-lang/use-lang';
import { getLangPrefix } from '~/common/constant/get-lang-prefix';
import { CartItem } from '~/apis/cart/cart.interface.api';

// ✅ Validation schema
const orderSchema = Yup.object({
  customerName: Yup.string().required('Vui lòng nhập tên khách hàng'),
  phone: Yup.string()
    .required('Vui lòng nhập số điện thoại')
    .matches(/^[0-9]{10}$/, 'Số điện thoại phải có 10 chữ số'),
  email: Yup.string().email('Email không hợp lệ').nullable(),
  gender: Yup.string().oneOf(['Nam', 'Nữ'], 'Vui lòng chọn giới tính'),
  province: Yup.object().nullable().required('Vui lòng chọn tỉnh/thành phố'),
  ward: Yup.object().nullable().required('Vui lòng chọn phường/xã'),
  street: Yup.string().required('Vui lòng nhập số nhà, đường'),
  note: Yup.string().nullable(),
  paymentMethod: Yup.string().oneOf(['cod', 'vnpay', 'momo'], 'Vui lòng chọn phương thức thanh toán'),
});

const OrderPage: React.FC = () => {
  const { palette } = useTheme();
  const { snackbar } = useSnackbar();
  const navigate = useNavigate();
  const location = useLocation();

  const currentLang = useLang();
  const prefix = getLangPrefix(currentLang);

  const orderData = location.state as {
    items: CartItem[];
    totalAmount: number;
  } | null;

  const [items, setItems] = useState<CartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Coupon states
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [discount, setDiscount] = useState(0);

  // Address states
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  // Formik setup
  const formik = useFormik({
    initialValues: {
      customerName: '',
      phone: '',
      email: '',
      gender: 'nam',
      province: null as Province | null,
      ward: null as Ward | null,
      street: '',
      note: '',
      paymentMethod: 'cod',
    },
    validationSchema: orderSchema,
    onSubmit: async (values) => {
      const fullAddress = {
        gender: values.gender,
        name: values.customerName,
        phone: values.phone,
        email: values.email,
        street: values.street,
        ward: values.ward?.name,
        province: values.province?.name,
      };
      setIsSubmitting(true);
      try {
        // Tạo đơn hàng
        const order = await orderApi.createOrder({
          items,
          total_amount: finalAmount,
          shipping_address: fullAddress,
          payment_method: values.paymentMethod as 'cod' | 'vnpay' | 'momo',
          note: values.note,
          coupon_code: selectedCoupon?.code,
          discount_amount: discount,
        });

        snackbar('success', 'Tạo đơn hàng thành công!');
        if (values.paymentMethod === 'vnpay') {
          const result = await paymentApi.createPayment({
            amount: finalAmount,
            order_id: order.data?.code,
            order_info: `Thanh toán đơn hàng #${order.data?.code}`,
            bank_code: 'NCB',
            return_url: `${window.location.origin}${prefix}/payment`, // ✅ Frontend URL
          });
          snackbar('success', 'Chuyển đến trang thanh toán!');

          // Redirect đến VNPay
          window.location.href = result.data?.payment_url;
         }
      } catch (error: any) {
        snackbar('error', error?.response?.data?.message || 'Đặt hàng thất bại');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  // Load user profile để điền sẵn thông tin
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const user = await userApi.getProfile();
        formik.setValues({
          ...formik.values,
          customerName: user.name || '',
          phone: user.phone || '',
          email: user.email || '',
        });
      } catch (error) {
        // User chưa đăng nhập hoặc lỗi
      }
    };
    loadUserProfile();
  }, []);

  // Load active coupons
  useEffect(() => {
    const fetchActiveCoupons = async () => {
      try {
        const coupons = await couponApi.getActiveCoupons();
        setAvailableCoupons(coupons);
      } catch (error) {
        console.error('Không thể tải danh sách mã giảm giá:', error);
      }
    };
    fetchActiveCoupons();
  }, []);

  // Load provinces
  useEffect(() => {
    (async () => {
      try {
        const list = await vnAddressApi.getProvinces();
        setProvinces(list);
      } catch {
        snackbar('error', 'Không tải được danh sách tỉnh/thành');
      }
    })();
  }, [snackbar]);

  // Load wards khi chọn province
  useEffect(() => {
    if (!formik.values.province) {
      setWards([]);
      formik.setFieldValue('ward', null);
      return;
    }
    (async () => {
      try {
        if (formik.values.province) {
          const result = await vnAddressApi.getWardsByProvince(formik.values.province.code);
          setWards(result);
        }
        formik.setFieldValue('ward', null);
      } catch {
        snackbar('error', 'Không tải được phường/xã');
      }
    })();
  }, [formik.values.province]);

  // Nhận data từ Cart
  useEffect(() => {
    if (!orderData || !orderData.items || orderData.items.length === 0) {
      snackbar('error', 'Không có sản phẩm nào được chọn');
      navigate(`${prefix}/cart`);
      return;
    }
    setItems(orderData.items);
    setTotalAmount(orderData.totalAmount);
  }, [orderData, prefix, navigate, snackbar]);

  // Tính discount khi chọn coupon
  useEffect(() => {
    if (!selectedCoupon) {
      setDiscount(0);
      return;
    }

    const minOrder = parseFloat(selectedCoupon.min_order_amount);
    if (totalAmount < minOrder) {
      snackbar('warning', `Đơn hàng tối thiểu ${FormatPrice(minOrder)} để sử dụng mã này`);
      setSelectedCoupon(null);
      setDiscount(0);
      return;
    }

    let discountAmount = 0;
    if (selectedCoupon.discount_type === 'percentage') {
      discountAmount = totalAmount * (parseFloat(selectedCoupon.discount_value) / 100);
    } else {
      discountAmount = parseFloat(selectedCoupon.discount_value);
    }

    setDiscount(discountAmount);
    snackbar('success', `Áp dụng mã giảm giá thành công! Giảm ${FormatPrice(discountAmount)}`);
  }, [selectedCoupon, totalAmount]);

  const finalAmount = totalAmount - discount;

  if (!orderData) return null;

  return (
    <Container maxWidth="lg" sx={{ py: PADDING_GAP_LAYOUT }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        Đặt hàng
      </Typography>

      <form onSubmit={formik.handleSubmit}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
          {/* Left: Customer Info + Shipping */}
          <Paper sx={{ p: 3, flex: 1 }}>
            <Typography variant="h6" sx={{ mb: 2, fontSize: 20, fontWeight: 600 }}>
              Thông tin khách hàng
            </Typography>

            <RadioGroup
              name="gender"
              value={formik.values.gender}
              onChange={formik.handleChange}
              sx={{ display: 'flex', flexDirection: 'row', mb: 2 }}
            >
              <FormControlLabel value="Nam" control={<Radio />} label="Anh" />
              <FormControlLabel value="Nữ" control={<Radio />} label="Chị" />
            </RadioGroup>

            <Stack spacing={2}>
              <TextField
                fullWidth
                name="customerName"
                label="Tên khách hàng"
                placeholder="Ví dụ: Nguyễn Văn A"
                value={formik.values.customerName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.customerName && Boolean(formik.errors.customerName)}
                helperText={formik.touched.customerName && formik.errors.customerName}
                required
              />

              <Grid container spacing={2} sx={{ width: '100%' }}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    name="phone"
                    label="Số điện thoại"
                    placeholder="Ví dụ: 0123456789"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.phone && Boolean(formik.errors.phone)}
                    helperText={formik.touched.phone && formik.errors.phone}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    name="email"
                    label="Email"
                    placeholder="Ví dụ: camenfood@gmail.com"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Autocomplete
                    options={provinces}
                    value={formik.values.province}
                    getOptionLabel={(o) => o?.name ?? ''}
                    onChange={(_, v) => formik.setFieldValue('province', v)}
                    onBlur={() => formik.setFieldTouched('province', true)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Tỉnh/Thành phố"
                        error={formik.touched.province && Boolean(formik.errors.province)}
                        helperText={formik.touched.province && formik.errors.province}
                        required
                        fullWidth
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Autocomplete
                    options={wards}
                    value={formik.values.ward}
                    getOptionLabel={(o) => o?.name ?? ''}
                    onChange={(_, v) => formik.setFieldValue('ward', v)}
                    onBlur={() => formik.setFieldTouched('ward', true)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Phường/Xã"
                        error={formik.touched.ward && Boolean(formik.errors.ward)}
                        helperText={formik.touched.ward && formik.errors.ward}
                        required
                      />
                    )}
                    disabled={!formik.values.province}
                  />
                </Grid>
              </Grid>

              <TextField
                fullWidth
                name="street"
                label="Số nhà, đường"
                placeholder="Ví dụ: 123 Lê Lợi"
                value={formik.values.street}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.street && Boolean(formik.errors.street)}
                helperText={formik.touched.street && formik.errors.street}
                required
              />

              <Divider sx={{ my: 2 }} />

              <TextField
                fullWidth
                name="note"
                label="Ghi chú"
                placeholder="Ghi chú cho đơn hàng (tùy chọn)"
                value={formik.values.note}
                onChange={formik.handleChange}
                multiline
                rows={3}
              />

              {/* Phương thức thanh toán */}
              <FormControl>
                <FormLabel>Phương thức thanh toán</FormLabel>
                <RadioGroup name="paymentMethod" value={formik.values.paymentMethod} onChange={formik.handleChange}>
                  <FormControlLabel value="cod" control={<Radio />} label="Thanh toán khi nhận hàng (COD)" />
                  <FormControlLabel value="vnpay" control={<Radio />} label="Thanh toán qua VNPay" />
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

            {/* Coupon Autocomplete */}
            <Autocomplete
              options={availableCoupons}
              value={selectedCoupon}
              onChange={(_, newValue) => {
                if (typeof newValue === 'object' && newValue !== null) {
                  setSelectedCoupon(newValue);
                } else {
                  setSelectedCoupon(null);
                }
              }}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.code)}
              renderOption={(props, option) => (
                <Box
                  component="li"
                  {...props}
                  sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', py: 1.5 }}
                >
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ width: '100%', mb: 0.5 }}>
                    <CouponIcon sx={{ fontSize: 18, color: palette.primary.main }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {option.code}
                    </Typography>
                    <Chip
                      label={
                        option.discount_type === 'percentage'
                          ? `${option.discount_value}%`
                          : FormatPrice(parseFloat(option.discount_value))
                      }
                      size="small"
                      color="primary"
                      sx={{ ml: 'auto' }}
                    />
                  </Stack>
                  <Typography variant="caption" color="text.secondary">
                    Đơn tối thiểu: {FormatPrice(parseFloat(option.min_order_amount))}
                  </Typography>
                  {option.usage_limit && (
                    <Typography variant="caption" color="text.secondary">
                      Còn lại: {option.usage_limit - option.used_count}/{option.usage_limit}
                    </Typography>
                  )}
                </Box>
              )}
              renderInput={(params) => (
                <TextField {...params} label="Mã giảm giá" placeholder="Chọn hoặc nhập mã giảm giá" />
              )}
              freeSolo
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
                    Giảm giá ({selectedCoupon?.code})
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
                <Typography variant="body2">Miễn phí</Typography>
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
              type="submit"
              disabled={isSubmitting || !formik.isValid}
            >
              {isSubmitting ? 'Đặt hàng' : 'Đặt hàng'}
            </Button>

            <Button
              fullWidth
              variant="outlined"
              sx={{ mt: 2 }}
              onClick={() => navigate(`${prefix}/cart`)}
              disabled={isSubmitting}
            >
              Quay lại giỏ hàng
            </Button>
          </Paper>
        </Stack>
      </form>
    </Container>
  );
};

export default OrderPage;
