import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Stack,
  Box,
  Chip,
  Divider,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Coupon } from '~/apis/coupon/coupon.api.interface';
import { FormatPrice } from '~/components/elements/format-price/format-price.element';
import { formatDate } from '~/common/until/date-format.until';

type Props = {
  open: boolean;
  onClose: () => void;
  coupon: Coupon | null;
};

const stateColorMap: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'error',
  expired: 'default',
  disabled: 'default',
};

export default function CouponViewModal({ open, onClose, coupon }: Props) {
  if (!coupon) return null;

  const remaining =
    (coupon.usage_limit || 0) - (coupon.used_count || 0) >= 0
      ? (coupon.usage_limit || 0) - (coupon.used_count || 0)
      : 0;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Chi tiết mã giảm giá</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Mã code
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
              <Typography variant="h6" fontWeight={700}>
                {coupon.code}
              </Typography>
              <Chip
                size="small"
                color={stateColorMap[coupon.state || ''] || 'default'}
                label={coupon.state || 'N/A'}
                sx={{ textTransform: 'capitalize' }}
              />
              <Chip
                size="small"
                variant={coupon.is_active ? 'filled' : 'outlined'}
                color={coupon.is_active ? 'primary' : 'default'}
                label={coupon.is_active ? 'Active' : 'Inactive'}
              />
            </Stack>
          </Box>

          <Divider />

          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Thông tin giảm giá
            </Typography>
            <Stack spacing={1}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2">Loại giảm giá:</Typography>
                <Typography variant="body2" fontWeight={600} textTransform="capitalize">
                  {coupon.discount_type}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2">Giá trị giảm:</Typography>
                <Typography variant="body2" fontWeight={600}>
                  {coupon.discount_type === 'percentage'
                    ? `${coupon.discount_value}%`
                    : FormatPrice(coupon.discount_value)}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2">Đơn hàng tối thiểu:</Typography>
                <Typography variant="body2" fontWeight={600}>
                  {FormatPrice(coupon.min_order_amount)}
                </Typography>
              </Stack>
            </Stack>
          </Box>

          <Divider />

          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Thông tin sử dụng
            </Typography>
            <Stack spacing={1}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2">Giới hạn sử dụng:</Typography>
                <Typography variant="body2" fontWeight={600}>
                  {coupon.usage_limit ?? 'Không giới hạn'}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2">Đã sử dụng:</Typography>
                <Typography variant="body2" fontWeight={600}>
                  {coupon.used_count ?? 0}
                </Typography>
              </Stack>
              {typeof coupon.usage_limit === 'number' && (
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">Còn lại:</Typography>
                  <Typography variant="body2" fontWeight={700} color="primary.main">
                    {remaining}
                  </Typography>
                </Stack>
              )}
            </Stack>
          </Box>

          <Divider />

          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Thời gian hiệu lực
            </Typography>
            <Stack spacing={1}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2">Ngày bắt đầu:</Typography>
                <Typography variant="body2" fontWeight={600}>
                  {formatDate(coupon.start_date)}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2">Ngày kết thúc:</Typography>
                <Typography variant="body2" fontWeight={600}>
                  {formatDate(coupon.end_date)}
                </Typography>
              </Stack>
            </Stack>
          </Box>

          <Divider />

          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Người tạo</Typography>
            <Typography variant="body2" fontWeight={600}>
              {coupon.user?.name || 'N/A'}
            </Typography>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">Đóng</Button>
      </DialogActions>
    </Dialog>
  );
}