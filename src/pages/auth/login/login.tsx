import React, { useState } from 'react';
import { Box, Button, Stack, TextField, Typography, Alert } from '@mui/material';
import { useAuth } from '~/common/auth/auth.context';
import { useNavigate } from 'react-router-dom';
import { SITE_SCREEN } from '~/router/path.route';

export default function LoginPage() {
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
      navigate(`/vi/${SITE_SCREEN.HOME}`, { replace: true });
    } catch (ex: any) {
      setErr(ex?.response?.data?.error ?? 'Đăng nhập thất bại');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
      <Box component="form" onSubmit={submit} sx={{ width: 360 }}>
        <Stack spacing={2}>
          <Typography variant="h5" fontWeight={700}>
            Đăng nhập
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
          <Button type="submit" variant="contained" disabled={busy}>
            {busy ? 'Đang xử lý…' : 'Đăng nhập'}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
