import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Stack,
  Box,
  Divider,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  TextField,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { updateActiveCoupon, updateStatusCoupon } from '~/apis/coupon/coupon.api';
import { Coupon } from '~/apis/coupon/coupon.interface.api';
import { FormatPrice } from '~/components/elements/format-price/format-price.element';
import { formatDate } from '~/common/until/date-format.until';
import { TagElement } from '~/components/elements/tag/tag.element';
import { getValidityStatus, StateLabel, StateTagType } from './coupon.state';
import { useSnackbar } from '~/hooks/use-snackbar/use-snackbar';

type Props = {
  open: boolean;
  onClose: () => void;
  coupon: Coupon | null;
  onSubmitted: () => void;
  role: string;
};

const CouponUpdateModal: React.FC<Props> = ({ open, onClose, coupon, onSubmitted, role }) => {
  const [decision, setDecision] = useState('approve');
  const [activeStatus, setActiveStatus] = useState<number>(1);
  const [reasonEnd, setReasonEnd] = useState<string>('');
  const [reasonReject, setReasonReject] = useState<string>('');
  const [reasonRejectError, setReasonRejectError] = useState<boolean>(false);
  const [reasonEndError, setReasonEndError] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const { snackbar } = useSnackbar();
  if (!coupon) return null;
  const remaining =
    (coupon.usage_limit || 0) - (coupon.used_count || 0) >= 0
      ? (coupon.usage_limit || 0) - (coupon.used_count || 0)
      : 0;

  const handleUpdateApproval = async () => {
    setLoading(true);

    // validate required reason when rejecting
    if (decision === 'reject' && !reasonReject.trim()) {
      setReasonRejectError(true);
      snackbar('error', 'Vui lòng nhập lý do từ chối');
      setLoading(false);
      return;
    }

    try {
      const newState = decision === 'approve' ? 'approved' : 'rejected';
      const payload: any = { state: newState };
      if (newState === 'rejected' && reasonReject) payload.reason_end = reasonReject;
      await updateStatusCoupon(coupon.id, payload);
      if (newState === 'approved') setReasonReject('');
      snackbar('success', 'Duyệt thành công');
      onClose();
      if (onSubmitted) await onSubmitted();
    } catch (err) {
      snackbar('error', 'Duyệt thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateActiveStatus = async () => {
    setLoading(true);

    // validate required reason when deactivating
    if (activeStatus === 0 && !reasonEnd.trim()) {
      setReasonEndError(true);
      snackbar('error', 'Vui lòng nhập lý do ngưng hoạt động');
      setLoading(false);
      return;
    }

    try {
      if (activeStatus === 1) {
        setReasonEnd('');
      }
      await updateActiveCoupon(coupon.id, { is_active: activeStatus === 1 ? true : false, reason_end: reasonEnd });
      snackbar('success', 'Cập nhật thành công');
      onClose();
      if (onSubmitted) await onSubmitted();
    } catch (err) {
      snackbar('error', 'Cập nhật thất bại');
    } finally {
      setLoading(false);
    }
  };

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

              <TagElement type={StateTagType[coupon.state]} content={StateLabel[coupon.state]} width={120} />
              <TagElement
                type={coupon.is_active ? 'success' : 'error'}
                content={coupon.is_active ? 'Hoạt động' : 'Không hoạt động'}
                width={120}
              />
              {(() => {
                const validity = getValidityStatus(coupon);
                return validity.label ? (
                  <TagElement type={validity.type || 'info'} content={validity.label} width={140} />
                ) : null;
              })()}
            </Stack>
          </Box>
          {/* Thêm radio Duyệt / Từ chối */}
          <FormControl component="fieldset" sx={{ ml: 2 }}>
            <FormLabel component="legend" sx={{ fontSize: 12, mb: 0.5 }}>
              Xử lý
            </FormLabel>
            {role === 'root' ? (
              <Stack>
                <RadioGroup row value={decision ?? 'approve'} onChange={(e) => setDecision(e.target.value)}>
                  <FormControlLabel value="approve" control={<Radio />} label="Duyệt" />
                  <FormControlLabel value="reject" control={<Radio />} label="Từ chối" />
                </RadioGroup>
                {decision === 'reject' && (
                  <TextField
                    label="Lý do từ chối"
                    multiline
                    rows={3}
                    value={reasonReject}
                    onChange={(e) => {
                      setReasonReject(e.target.value);
                      if (e.target.value.trim()) setReasonRejectError(false);
                    }}
                    error={reasonRejectError}
                    helperText={reasonRejectError ? 'Lý do từ chối là bắt buộc' : ' '}
                  />
                )}
              </Stack>
            ) : (
              <Stack>
                <RadioGroup row value={String(activeStatus)} onChange={(e) => setActiveStatus(Number(e.target.value))}>
                  <FormControlLabel value="1" control={<Radio />} label="Hoạt động" />
                  <FormControlLabel value="0" control={<Radio />} label="Ngưng hoạt động" />
                </RadioGroup>
                {activeStatus === 0 && (
                  <TextField
                    label="Lý do ngưng hoạt động"
                    multiline
                    rows={3}
                    value={reasonEnd}
                    onChange={(e) => {
                      setReasonEnd(e.target.value);
                      if (e.target.value.trim()) setReasonEndError(false);
                    }}
                    error={reasonEndError}
                    helperText={reasonEndError ? 'Lý do ngưng hoạt động là bắt buộc' : ' '}
                  />
                )}
              </Stack>
            )}
          </FormControl>
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
              Người tạo
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {coupon.user?.name || 'N/A'}
            </Typography>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Đóng
        </Button>
        {role === 'root' ? (
          <Button onClick={handleUpdateApproval} variant="contained" disabled={loading}>
            Lưu
          </Button>
        ) : (
          <Button onClick={handleUpdateActiveStatus} variant="contained" disabled={loading}>
            Lưu
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CouponUpdateModal;
