import { Box, Container, Divider, IconButton, Stack, Typography, useTheme, useMediaQuery, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Facebook, YouTube, Instagram, LocationOn, Phone, Email } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Logo from '~/components/logo/logo';
import { StackRowAlignCenter, StackRowAlignJustCenter } from '~/components/elements/styles/stack.style';

export default function Footer() {
  const { palette } = useTheme();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Stack component="footer" sx={{ bgcolor: palette.background.default, borderTop: `1px solid ${palette.divider}` }}>
      {/* Hàng 1: khác nhau giữa desktop và mobile */}
      {isMobile ? (
        <Container maxWidth="lg" sx={{ py: 2 }}>
          <Stack spacing={2} alignItems="center">
            <Box sx={{ maxWidth: 160 }}>
              <Logo />
            </Box>
            <Stack spacing={0.5} alignItems="center">
              <Typography variant="subtitle2" sx={{ fontWeight: 700, textAlign: 'center' }}>
                CÔNG TY TNHH SẢN XUẤT & THƯƠNG MẠI CÀ MÈN
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <LocationOn fontSize="small" color="action" />
                <Typography variant="caption" color="text.secondary">17 Hồ Hảo Hớn, P. Cầu Ông Lãnh, TP.HCM</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <Phone fontSize="small" color="action" />
                <Typography variant="caption" color="text.secondary">0938 13 53 36</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <Email fontSize="small" color="action" />
                <Typography variant="caption" color="text.secondary">support@camen.com</Typography>
              </Stack>
            </Stack>
            <Stack direction="row" spacing={1}>
              <IconButton color="primary" size="small" aria-label="Facebook"><Facebook /></IconButton>
              <IconButton color="primary" size="small" aria-label="YouTube"><YouTube /></IconButton>
              <IconButton color="primary" size="small" aria-label="Instagram"><Instagram /></IconButton>
            </Stack>
          </Stack>
        </Container>
      ) : (
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Grid container spacing={3} alignItems="center">
            {/* Logo */}
            <Grid size={{ xs: 12, md:4, lg:4 }}>
              <Box sx={{ maxWidth: 200 }}>
                <Logo />
              </Box>
            </Grid>

            {/* Liên hệ */}
            <Grid size={{ xs: 12, md:5 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                CÔNG TY TNHH SẢN XUẤT & THƯƠNG MẠI CÀ MÈN
              </Typography>
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} alignItems="flex-start">
                  <LocationOn fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    17 Hồ Hảo Hớn, Phường Cầu Ông Lãnh, TP.HCM
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Phone fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">0938 13 53 36</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Email fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">support@camen.com</Typography>
                </Stack>
              </Stack>
            </Grid>

            {/* Kết nối với chúng tôi */}
            <Grid size={{ xs: 12, md:3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Kết nối với chúng tôi</Typography>
              <Stack direction="row" spacing={1}>
                <IconButton color="primary" size="small" aria-label="Facebook"><Facebook /></IconButton>
                <IconButton color="primary" size="small" aria-label="YouTube"><YouTube /></IconButton>
                <IconButton color="primary" size="small" aria-label="Instagram"><Instagram /></IconButton>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      )}

      <Divider />

      {/* Hàng 2: Phòng ban - mobile dùng Accordion */}
      {isMobile ? (
        <Container maxWidth="lg" sx={{ py: 1 }}>
          <Stack spacing={1}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography>Phòng nội địa</Typography></AccordionSummary>
              <AccordionDetails>
                <Stack spacing={0.5}>
                  <StackRowAlignJustCenter>
                    <Typography variant="subtitle2">Điện thoại:</Typography><Typography>0865452731</Typography>
                  </StackRowAlignJustCenter>
                  <StackRowAlignJustCenter>
                    <Typography variant="subtitle2">Email:</Typography><Typography>tranvietquan@gmail.com</Typography>
                  </StackRowAlignJustCenter>
                </Stack>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography>Phòng xuất khẩu</Typography></AccordionSummary>
              <AccordionDetails>
                <Stack spacing={0.5}>
                  <StackRowAlignJustCenter>
                    <Typography variant="subtitle2">Điện thoại:</Typography><Typography>0865452731</Typography>
                  </StackRowAlignJustCenter>
                  <StackRowAlignJustCenter>
                    <Typography variant="subtitle2">Email:</Typography><Typography>tranvietquan@gmail.com</Typography>
                  </StackRowAlignJustCenter>
                </Stack>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography>Phòng marketing</Typography></AccordionSummary>
              <AccordionDetails>
                <Stack spacing={0.5}>
                  <StackRowAlignJustCenter>
                    <Typography variant="subtitle2">Điện thoại:</Typography><Typography>0865452731</Typography>
                  </StackRowAlignJustCenter>
                  <StackRowAlignJustCenter>
                    <Typography variant="subtitle2">Email:</Typography><Typography>tranvietquan@gmail.com</Typography>
                  </StackRowAlignJustCenter>
                </Stack>
              </AccordionDetails>
            </Accordion>
          </Stack>
        </Container>
      ) : (
        <StackRowAlignCenter sx={{ justifyContent: 'space-evenly', py: 2 }}>
          <Stack>
            <Typography variant="h6" sx={{ textAlign: 'center' }}>Phòng nội địa</Typography>
            <StackRowAlignJustCenter>
              <Typography variant="h6">Điện thoại: </Typography>
              <Typography> 0865452731</Typography>
            </StackRowAlignJustCenter>
            <StackRowAlignJustCenter sx={{ letterSpacing: 2 }}>
              <Typography variant="h6">Email: </Typography>
              <Typography> tranvietquan@gmail.com</Typography>
            </StackRowAlignJustCenter>
          </Stack>
          <Stack>
            <Typography variant="h6" sx={{ textAlign: 'center' }}>Phòng xuất khẩu</Typography>
            <StackRowAlignJustCenter>
              <Typography variant="h6">Điện thoại: </Typography>
              <Typography>0865452731</Typography>
            </StackRowAlignJustCenter>
            <StackRowAlignJustCenter>
              <Typography variant="h6">Email: </Typography>
              <Typography> tranvietquan@gmail.com</Typography>
            </StackRowAlignJustCenter>
          </Stack>
          <Stack>
            <Typography variant="h6" sx={{ textAlign: 'center' }}>Phòng marketing</Typography>
            <StackRowAlignJustCenter>
              <Typography variant="h6">Điện thoại: </Typography>
              <Typography>0865452731</Typography>
            </StackRowAlignJustCenter>
            <StackRowAlignJustCenter>
              <Typography variant="h6">Email: </Typography>
              <Typography>tranvietquan@gmail.com</Typography>
            </StackRowAlignJustCenter>
          </Stack>
        </StackRowAlignCenter>
      )}

      <Divider />

      {/* Copyright */}
      <Typography variant='subtitle2' sx={{ py: 1, textAlign: 'center', color: palette.text.secondary }}>BẢN QUYỀN @ 2025 THUỘC VỀ CÔNG TY CÀ MÈN FOOD VIỆT NAM</Typography>
    </Stack>
  );
}
