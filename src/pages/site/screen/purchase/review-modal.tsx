import React, { useEffect, useRef, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Typography,
  Rating,
  IconButton,
  Box,
  Divider,
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { OrderDetail } from '~/apis/order/order.interface.api';
import { useSnackbar } from '~/hooks/use-snackbar/use-snackbar';
import { StackRow } from '~/components/elements/styles/stack.style';
import { reviewApi } from '~/apis';

type Props = {
  open: boolean;
  onClose: () => void;
  order: OrderDetail | null;
  onSubmitted?: () => void;
};

const MAX_IMAGES = 5;

type ReviewState = {
  rating: number | null;
  comment: string;
  images: File[];
  previews: string[];
};

const ReviewModal: React.FC<Props> = ({ open, onClose, order, onSubmitted }) => {
  const { snackbar } = useSnackbar();
  const [reviews, setReviews] = useState<Record<string, ReviewState>>({});
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});


  useEffect(() => {
    if (open) {
      // initialize per-item review state
      const map: Record<string, ReviewState> = {};
      order?.order_items.forEach((it) => {
        const key = String(it.id ?? it.product?.id ?? Math.random());
        map[key] = { rating: 5, comment: '', images: [], previews: [] };
      });
      // revoke any previous previews
      Object.values(reviews).forEach((r) => r.previews.forEach((u) => URL.revokeObjectURL(u)));
      setReviews(map);
    }
  }, [open]); // eslint-disable-line

  // cleanup all object URLs on unmount
  useEffect(() => {
    return () => {
      Object.values(reviews).forEach((r) => r.previews.forEach((u) => URL.revokeObjectURL(u)));
    };
  }, [reviews]);

  const handleFiles = (itemKey: string, files: FileList | null) => {
    if (!files) return;
    const list = Array.from(files).filter((f) => f.type.startsWith('image/'));
    const cur = reviews[itemKey] || { rating: 5, comment: '', images: [], previews: [] };
    const remaining = Math.max(0, MAX_IMAGES - cur.images.length);
    const toAdd = list.slice(0, remaining);
    if (toAdd.length === 0) {
      snackbar('warning', `Chỉ được chọn tối đa ${MAX_IMAGES} ảnh`);
      return;
    }
    const newPreviews = toAdd.map((f) => URL.createObjectURL(f));
    setReviews((prev) => ({
      ...prev,
      [itemKey]: {
        ...cur,
        images: [...cur.images, ...toAdd],
        previews: [...cur.previews, ...newPreviews],
      },
    }));
  };

  const handleRemoveFor = (itemKey: string, index: number) => {
    const cur = reviews[itemKey];
    if (!cur) return;
    const removed = cur.previews[index];
    if (removed) URL.revokeObjectURL(removed);
    const newImages = cur.images.filter((_, i) => i !== index);
    const newPreviews = cur.previews.filter((_, i) => i !== index);
    setReviews((prev) => ({ ...prev, [itemKey]: { ...cur, images: newImages, previews: newPreviews } }));
  };

  const handlePickClickFor = (itemKey: string) => {
    const ref = inputRefs.current[itemKey];
    if (ref) ref.click();
  };

  const handleSubmit = async () => {
    if (!order) return;
    try {
      const formData = new FormData();
      order.order_items.forEach((it, idx) => {
        const key = String(it.id ?? it.product?.id ?? idx);
        const r = reviews[key];
        if (!r) return;
        formData.append(`review[${idx}][order_item_id]`, String(it.id));
        formData.append(`review[${idx}][rating]`, String(r.rating));
        formData.append(`review[${idx}][comment]`, String(r.comment));

        r.images.forEach((img) => formData.append(`images_${key}[]`, img));
      });

      Array.from(formData.entries()).forEach(([k, v]) => {
        console.log(k, v);
      });
      const result = await reviewApi.createReview(formData);
      snackbar('success', result.message || 'Gửi đánh giá thành công');
      if (onSubmitted) await onSubmitted();
      onClose();
    } catch (e) {
      console.error(e);
      snackbar('error', 'Gửi đánh giá thất bại');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Đánh giá sản phẩm {order?.code}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {order?.order_items.map((item, idx) => {
            const key = String(item.id ?? item.product?.id ?? idx);
            const state = reviews[key] ?? { rating: 5, comment: '', images: [], previews: [] };
            return (
              <Stack key={key} spacing={2}>
                <StackRow columnGap={2}>
                  <Stack
                    component="img"
                    src={item.product.product_images[0]?.image_url || ''}
                    alt={'product-image'}
                    sx={{
                      width: 60,
                      height: 60,
                      objectFit: 'cover',
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  />
                  <Typography>{item.product.product_translations[0]?.name}</Typography>
                </StackRow>
                <Stack sx={{ width: '100%' }} spacing={1}>
                  <StackRow>
                    <Typography>Đánh giá của bạn:</Typography>
                    <Rating
                      value={state.rating}
                      onChange={(_, v) => setReviews((prev) => ({ ...prev, [key]: { ...state, rating: v } }))}
                    />
                  </StackRow>
                  <TextField
                    label="Nhận xét"
                    multiline
                    minRows={4}
                    value={state.comment}
                    onChange={(e) => setReviews((prev) => ({ ...prev, [key]: { ...state, comment: e.target.value } }))}
                    fullWidth
                  />
                  {/* Image picker */}
                  <Box>
                    <input
                      ref={(el) => { inputRefs.current[key] = el; }}
                      type="file"
                      accept="image/*"
                      multiple
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        handleFiles(key, e.target.files);
                        if (e.target) e.target.value = '';
                      }}
                    />
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Button
                        startIcon={<PhotoCameraIcon />}
                        onClick={() => handlePickClickFor(key)}
                        disabled={state.images.length >= MAX_IMAGES}
                      >
                        Chọn ảnh ({state.images.length}/{MAX_IMAGES})
                      </Button>
                      <Typography variant="caption" color="text.secondary">
                        Tối đa {MAX_IMAGES} ảnh.
                      </Typography>
                    </Stack>
                    {state.previews.length > 0 && (
                      <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
                        {state.previews.map((src, i) => (
                          <Box key={src} sx={{ position: 'relative' }}>
                            <Box
                              component="img"
                              src={src}
                              alt={`preview-${i}`}
                              sx={{
                                width: 60,
                                height: 60,
                                objectFit: 'cover',
                                borderRadius: 1,
                                border: '1px solid',
                                borderColor: 'divider',
                              }}
                            />
                            <IconButton
                              size="small"
                              onClick={() => handleRemoveFor(key, i)}
                              sx={{
                                position: 'absolute',
                                top: -6,
                                right: -6,
                                bgcolor: 'background.paper',
                                boxShadow: 1,
                                '&:hover': { bgcolor: 'background.paper' },
                              }}
                            >
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        ))}
                      </Stack>
                    )}
                  </Box>
                </Stack>
                <Divider />
              </Stack>
            );
          })}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={handleSubmit} type='button'>
          Gửi đánh giá
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReviewModal;
