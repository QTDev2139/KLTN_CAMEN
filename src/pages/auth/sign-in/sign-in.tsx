import React, { useState } from 'react';
import { Box, Button, Stack, TextField, Typography, Alert, Divider } from '@mui/material';
import { useAuth } from '~/common/auth/auth.context';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AUTH_SCREEN, DASHBOARD_SCREEN, PAGE, SITE_SCREEN } from '~/router/path.route';
import { authApi } from '~/apis/auth/auth.api';
import { FONT_SIZE } from '~/common/constant/style.constant';
import Logo from '~/components/logo/logo';
import { StackRowAlignCenter, StackRowJustEnd } from '~/components/elements/styles/stack.style';

export default function LoginPage() {
  const { lang } = useParams();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      await login(email, password);
      const me = await authApi.profile(); // lấy user mới nhất từ BE
      if (me.role_id === 4) {
        navigate(`/vi/${SITE_SCREEN.HOME}`, { replace: true });
      } else {
        navigate('/dashboard/' + DASHBOARD_SCREEN.OVERVIEW, { replace: true });
      }
    } catch (ex: any) {
      setErr(ex?.response?.data?.error ?? 'Đăng nhập thất bại');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
      <Box
        component="form"
        onSubmit={submit}
        sx={{
          padding: '24px 40px',
          border: '1px solid #ccc',
          maxWidth: '360px',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          position: 'relative',
        }}
      >
        <Stack spacing={2}>
          <Logo />
          <Typography variant="h5" sx={{ textAlign: 'center', fontSize: FONT_SIZE.large, paddingBottom: '20px' }}>
            Sign in to CamenFood
          </Typography>
          {err && <Alert severity="error">{err}</Alert>}
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Mật khẩu"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
          />
          <StackRowJustEnd>
            <Link to={`/${lang}/auth/${AUTH_SCREEN.FORGOT_PW}`} replace style={{ fontSize: FONT_SIZE.small }}>
              Forgot password?
            </Link>
          </StackRowJustEnd>
          <Button type="submit" variant="contained" disabled={busy} sx={{ padding: '10px' }}>
            {busy ? 'Đang xử lý…' : 'Sign in'}
          </Button>
          <StackRowAlignCenter sx={{ my: 3 }}>
            <Divider sx={{ flex: 1 }} />
            <Typography sx={{ padding: '10px' }}>or</Typography>
            <Divider sx={{ flex: 1 }} />
          </StackRowAlignCenter>
          <StackRowAlignCenter sx={{ justifyContent: 'center' }}>
            <Typography sx={{ paddingRight: '6px' }}>New to CamenFood?</Typography>
            <Link to={`/${lang}/auth/${AUTH_SCREEN.SIGN_UP}`} replace>
              Create an account
            </Link>
          </StackRowAlignCenter>
        </Stack>
      </Box>
    </Box>
  );
}
