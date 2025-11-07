import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Stack } from '@mui/material';

type ModalElementProps = {
  open: boolean;
  title?: string;
  message?: string;
  onClose: () => void;
  onConfirm?: () => void;
  loading?: boolean;
  confirmText?: string;
  confirmColor?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  cancelText?: string;
  icon?: React.ReactNode;
  iconColor?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' | 'inherit' | 'action' | 'disabled';
};

export const ModalElement: React.FC<ModalElementProps> = ({
  open,
  title = 'Xác nhận',
  message = 'Bạn có chắc chắn muốn thực hiện hành động này?',
  onClose,
  onConfirm,
  loading = false,
  confirmText = 'Xác nhận',
  confirmColor = 'info',
  cancelText = 'Hủy',
  icon,
  iconColor = 'warning',
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 2, p: 1 } }}>
      <DialogTitle>
        <Stack direction="row" alignItems="center" gap={1}>
          {icon && (
            <>
              {React.isValidElement(icon)
                ? React.cloneElement(icon as React.ReactElement<any>, {
                    color: iconColor,
                  })
                : icon}
            </>
          )}
          <Typography variant="h6">{title}</Typography>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body1">{message}</Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit" variant="outlined" disabled={loading}>
          {cancelText}
        </Button>
        <Button onClick={onConfirm} color={confirmColor} variant="contained" disabled={loading}>
          {loading ? confirmText : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
