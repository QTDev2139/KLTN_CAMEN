import { Box, Container, Divider, IconButton, Stack, Typography, useTheme, useMediaQuery, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Facebook, YouTube, Instagram, LocationOn, Phone, Email } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Logo from '~/components/logo/logo';
import { StackRowAlignCenter, StackRowAlignJustCenter } from '~/components/elements/styles/stack.style';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation('footer');
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
                {t('company_name')}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <LocationOn fontSize="small" color="action" />
                <Typography variant="caption" color="text.secondary">{t('address')}</Typography>
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
                {t('company_name')}
              </Typography>
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} alignItems="flex-start">
                  <LocationOn fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {t('address')}
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
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>{t('connect_title')}</Typography>
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
              <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography>{t('department_domestic')}</Typography></AccordionSummary>
              <AccordionDetails>
                <Stack spacing={0.5}>
                  <StackRowAlignJustCenter>
                    <Typography variant="subtitle2">{t('phone_label')}</Typography><Typography>0865452731</Typography>
                  </StackRowAlignJustCenter>
                  <StackRowAlignJustCenter>
                    <Typography variant="subtitle2">{t('email_label')}</Typography><Typography>tranvietquan@gmail.com</Typography>
                  </StackRowAlignJustCenter>
                </Stack>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography>{t('department_export')}</Typography></AccordionSummary>
              <AccordionDetails>
                <Stack spacing={0.5}>
                  <StackRowAlignJustCenter>
                    <Typography variant="subtitle2">{t('phone_label')}</Typography><Typography>0865452731</Typography>
                  </StackRowAlignJustCenter>
                  <StackRowAlignJustCenter>
                    <Typography variant="subtitle2">{t('email_label')}</Typography><Typography>tranvietquan@gmail.com</Typography>
                  </StackRowAlignJustCenter>
                </Stack>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography>{t('department_marketing')}</Typography></AccordionSummary>
              <AccordionDetails>
                <Stack spacing={0.5}>
                  <StackRowAlignJustCenter>
                    <Typography variant="subtitle2">{t('phone_label')}</Typography><Typography>0865452731</Typography>
                  </StackRowAlignJustCenter>
                  <StackRowAlignJustCenter>
                    <Typography variant="subtitle2">{t('email_label')}</Typography><Typography>tranvietquan@gmail.com</Typography>
                  </StackRowAlignJustCenter>
                </Stack>
              </AccordionDetails>
            </Accordion>
          </Stack>
        </Container>
      ) : (
        <StackRowAlignCenter sx={{ justifyContent: 'space-evenly', py: 2 }}>
          <Stack>
            <Typography variant="h6" sx={{ textAlign: 'center' }}>{t('department_domestic')}</Typography>
            <StackRowAlignJustCenter>
              <Typography variant="h6">{t('phone_label')} </Typography>
              <Typography> 0865452731</Typography>
            </StackRowAlignJustCenter>
            <StackRowAlignJustCenter sx={{ letterSpacing: 2 }}>
              <Typography variant="h6">{t('email_label')} </Typography>
              <Typography> tranvietquan@gmail.com</Typography>
            </StackRowAlignJustCenter>
          </Stack>
          <Stack>
            <Typography variant="h6" sx={{ textAlign: 'center' }}>{t('department_export')}</Typography>
            <StackRowAlignJustCenter>
              <Typography variant="h6">{t('phone_label')} </Typography>
              <Typography>0865452731</Typography>
            </StackRowAlignJustCenter>
            <StackRowAlignJustCenter>
              <Typography variant="h6">{t('email_label')} </Typography>
              <Typography> tranvietquan@gmail.com</Typography>
            </StackRowAlignJustCenter>
          </Stack>
          <Stack>
            <Typography variant="h6" sx={{ textAlign: 'center' }}>{t('department_marketing')}</Typography>
            <StackRowAlignJustCenter>
              <Typography variant="h6">{t('phone_label')} </Typography>
              <Typography>0865452731</Typography>
            </StackRowAlignJustCenter>
            <StackRowAlignJustCenter>
              <Typography variant="h6">{t('email_label')} </Typography>
              <Typography>tranvietquan@gmail.com</Typography>
            </StackRowAlignJustCenter>
          </Stack>
        </StackRowAlignCenter>
      )}

      <Divider />

      {/* Copyright */}
      <Typography variant='subtitle2' sx={{ py: 1, textAlign: 'center', color: palette.text.secondary }}>
        {t('copyright_prefix')} {t('copyright_suffix')}
      </Typography>
    </Stack>
  );
}
