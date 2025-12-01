// PaymentCallbackPage.tsx
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Container, Paper, Stack, Typography, CircularProgress, Button, useTheme } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { PADDING_GAP_LAYOUT } from '~/common/constant/style.constant';
import { useLang } from '~/hooks/use-lang/use-lang';
import { getLangPrefix } from '~/common/constant/get-lang-prefix';

const CodConfirmationPage: React.FC = () => {
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
    // Chỉ đọc query params — không gọi BE
    const status = searchParams.get('status'); // success | failed | error
    const msg = searchParams.get('message') || '';
    const oid = searchParams.get('order_id') || searchParams.get('vnp_TxnRef') || '';

    setOrderId(oid);
    setSuccess(status === 'success');
    setMessage(msg || (status === 'success' ? 'Đặt hàng thành công!' : 'Xác minh thanh toán thất bại'));
    setLoading(false);
  }, [searchParams]);

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ py: PADDING_GAP_LAYOUT }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 3 }}>
            Đang xác thực đặt hàng...
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
                Đặt hàng thành công!
              </Typography>
              {orderId && (
                <Typography variant="body2" color="text.secondary">
                  Mã đơn hàng: <strong>{orderId}</strong>
                </Typography>
              )}
              <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                <Button variant="contained" size="large" onClick={() => navigate(`${prefix}/purchase`)}>
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

export default CodConfirmationPage;
