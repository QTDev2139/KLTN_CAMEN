import { Box, Button, Stack, Typography, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { userApi } from '~/apis';
import { FONT_SIZE } from '~/common/constant/style.constant';
import { StackRow } from '~/components/elements/styles/stack.style';
import Logo from '~/components/logo/logo';
import OtpInputComponent from '~/components/otp-input/otp-input';
import { useSnackbar } from '~/hooks/use-snackbar/use-snackbar';
import { ForgotPasswordMode } from './forgot-password.enum';
import { BoxForm } from '~/components/elements/forms/box/box-form';
import { ArrowCircleLeftOutlined } from '@mui/icons-material';

interface VerifyOtpSignUpProps {
  setMode: (mode: ForgotPasswordMode) => void;
  email: string;
}
export default function VerifyOtpForgottenPassword({ setMode, email }: VerifyOtpSignUpProps) {
  const { snackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [cooldownResend, setCooldownResend] = useState(0);
  const [cooldownOtp, setCooldownOtp] = useState(120);
  const [otp, setOtp] = useState('');
  const { palette } = useTheme();
  

  // Đếm ngược resend
  useEffect(() => {
    if (cooldownResend <= 0) return;
    const t = setInterval(() => setCooldownResend((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [cooldownResend]);

  // Đếm ngược time Otp
  useEffect(() => {
    if (cooldownOtp <= 0) return;
    const t = setInterval(() => setCooldownOtp((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [cooldownOtp]);

  const handleResend = async () => {
    try {
      setLoading(true);
      const res = await userApi.resendForgottenPassword({ email });
      snackbar('success', res);
      setCooldownResend(60);
      setCooldownOtp(120);
    } catch (err: any) {
      snackbar('warning', err?.response?.data?.message ?? 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };
  const handlePrev = () => {
    setMode(ForgotPasswordMode.REQUEST);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await userApi.verifyForgottenPassword({ email, otp });
      snackbar('success', res.message);
      localStorage.setItem('resetToken', res.reset_token);
      setMode(ForgotPasswordMode.RESET);
    } catch (err: any) {
      snackbar('warning', err?.response?.data?.message ?? 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={submit}>
      <BoxForm sx={{ position: 'relative' }}>
        <Button
          style={{ position: 'absolute', top: '10px', left: '10px', color: palette.text.primary }}
          onClick={handlePrev}
        >
          <ArrowCircleLeftOutlined sx={{ color: 'text.secondary' }} />
        </Button>
        <Logo />

        <Typography
          variant="subtitle2"
          sx={{ textAlign: 'center', width: '200px', fontSize: FONT_SIZE.small, color: '#666' }}
        >
          Mã xác minh đã được gửi đến <span style={{ color: '#00e67bff' }}>{email}</span>. Vui lòng nhập mã để tiếp tục
        </Typography>
        <Stack sx={{ padding: '16px 0' }}>
          <OtpInputComponent setOtp={setOtp} otp={otp} />
        </Stack>
        <Typography variant="subtitle2" style={{ paddingBottom: '10px', color: palette.text.secondary }}>
          {cooldownOtp > 0 ? `Thời gian còn lại để xác thực: ${cooldownOtp}s` : 'Vui lòng gửi lại email'}
        </Typography>
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          color="info"
          sx={{ minWidth: '120px', margin: '0 10px' }}
        >
          {loading ? 'Đang xử lý ...' : 'Xác thực tài khoản'}
        </Button>
        <StackRow sx={{ padding: '16px 0', gap: 1 }}>
          <Typography variant="subtitle2">Bạn chưa nhận được mã?</Typography>
          <Button
            color="info"
            onClick={handleResend}
            disabled={loading || cooldownResend > 0}
            sx={{
              border: 'none',
              background: 'none',
              color: palette.info.main,
              cursor: 'pointer',
              padding: 0,
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            {cooldownResend > 0 ? `Gửi lại sau ${cooldownResend}s` : 'Gửi lại'}
          </Button>
        </StackRow>
      </BoxForm>
    </Box>
  );
}
