import { Backdrop, Box, Fade, Modal, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

type Props = {
  open: boolean;
  onClose: () => void;
  src: string;
  alt?: string;
};

export default function ModalImage({ open, onClose, src, alt }: Props) {
  return (
    <Modal
      aria-labelledby="product-image-modal"
      open={open}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 300 } }}
    >
      <Fade in={open}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: '#fff',
            boxShadow: 24,
            outline: 'none',
            p: 2,
            borderRadius: 2,
            maxWidth: '92vw',
            maxHeight: '92vh',
          }}
        >
          <IconButton
            aria-label="close"
            onClick={onClose}
            size="small"
            sx={{
              zIndex: 10,
              bgcolor: 'rgba(0,0,0,0.4)',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.5)' },
              color: '#e4e4e4ff',
              position: 'absolute',
              top: 20,
              right: 20,
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
          <img
            src={src}
            alt={alt || 'image'}
            style={{
              display: 'block',
              maxWidth: '90vw',
              maxHeight: '90vh',
              height: 'auto',
              margin: 'auto',
            }}
          />
        </Box>
      </Fade>
    </Modal>
  );
}
