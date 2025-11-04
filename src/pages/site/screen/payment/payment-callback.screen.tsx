// PaymentCallbackPage.tsx
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Container, Paper, Stack, Typography, CircularProgress, Button, useTheme } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { PADDING_GAP_LAYOUT } from '~/common/constant/style.constant';
import { useLang } from '~/hooks/use-lang/use-lang';
import { getLangPrefix } from '~/common/constant/get-lang-prefix';
import { paymentApi } from '~/apis';

const PaymentCallbackPage: React.FC = () => {
  const { palette } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentLang = useLang();
  const prefix = getLangPrefix(currentLang);

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    const run = async () => {
      // 1) Đọc query BE đã redirect
      const status = searchParams.get('status');       // success | failed | error
      const msg = searchParams.get('message') || '';
      const code = searchParams.get('code') || '';
      const oid  = searchParams.get('order_id') || searchParams.get('vnp_TxnRef') || '';

      setOrderId(oid);

      // 2) Nếu muốn confirm với DB (khuyến nghị)
      try {
        if (oid) {
          const db = await paymentApi.getStatus(oid); // /payment/vnpay/status/{oid}
          // Nếu DB trả 'paid' -> success, ngược lại failed
          const paid = db?.data?.status === 'paid';
          setSuccess(status ? status === 'success' : paid);
          setMessage(
            msg ||
            (paid ? 'Thanh toán thành công!' :
              (status === 'failed' ? `Giao dịch thất bại${code ? ' (code ' + code + ')' : ''}` :
               'Xác thực thanh toán thất bại'))
          );
        } else {
          setSuccess(false);
          setMessage(msg || 'Thiếu mã đơn hàng');
        }
      } catch (e:any) {
        setSuccess(false);
        setMessage(msg || 'Không thể xác minh trạng thái đơn hàng');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [searchParams]);

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ py: PADDING_GAP_LAYOUT }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 3 }}>
            Đang xác thực thanh toán...
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: PADDING_GAP_LAYOUT }}>
      <Paper sx={{ p: 4 }}>
        <Stack spacing={3} alignItems="center">
          {success ? (
            <>
              <CheckCircleOutlineIcon sx={{ fontSize: 80, color: palette.success.main }} />
              <Typography variant="h4" sx={{ fontWeight: 700, color: palette.success.main }}>
                Thanh toán thành công!
              </Typography>
              {orderId && (
                <Typography variant="body2" color="text.secondary">
                  Mã đơn hàng: <strong>{orderId}</strong>
                </Typography>
              )}
              <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                <Button variant="contained" size="large" onClick={() => navigate(`${prefix}/order/${orderId}`)}>
                  Xem đơn hàng
                </Button>
                <Button variant="outlined" size="large" onClick={() => navigate(`${prefix}/home`)}>
                  Về trang chủ
                </Button>
              </Stack>
            </>
          ) : (
            <>
              <ErrorOutlineIcon sx={{ fontSize: 80, color: palette.error.main }} />
              <Typography variant="h4" sx={{ fontWeight: 700, color: palette.error.main }}>
                Thanh toán thất bại
              </Typography>
              <Typography variant="body1" color="text.secondary" textAlign="center">
                {message}
              </Typography>
              <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                <Button variant="contained" size="large" onClick={() => navigate(`${prefix}/cart`)}>
                  Quay lại giỏ hàng
                </Button>
                <Button variant="outlined" size="large" onClick={() => navigate(`${prefix}/home`)}>
                  Về trang chủ
                </Button>
              </Stack>
            </>
          )}
        </Stack>
      </Paper>
    </Container>
  );
};

export default PaymentCallbackPage;
