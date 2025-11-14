import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

type ModalConfirmProps = {
  open: boolean;
  title?: string;
  message?: string;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
};

export const ModalConfirm: React.FC<ModalConfirmProps> = ({
  open,
  title = 'Xác nhận',
  message = 'Bạn có chắc chắn muốn thực hiện hành động này?',
  onClose,
  onConfirm,
  loading = false,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2, p: 1 } }}
    >
      <DialogTitle>
        <Stack direction="row" alignItems="center" gap={1}>
          <WarningAmberIcon color="warning" />
          <Typography variant="h6">{title}</Typography>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body1">{message}</Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit" variant="outlined">
          Hủy
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          disabled={loading}
        >
          {loading ? 'Xác nhận' : 'Xác nhận'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
