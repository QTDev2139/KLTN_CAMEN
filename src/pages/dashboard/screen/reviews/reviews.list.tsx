import TableElement from '~/components/elements/table-element/table-element';
import { StackRow } from '~/components/elements/styles/stack.style';
import { TableRow, TableCell, Typography, Rating, Stack, Box, useTheme, Tooltip, IconButton } from '@mui/material';
import { DeleteOutline } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { reviewApi } from '~/apis';
import { Review } from '~/apis/review/review.interface.api';
import ModalImage from '~/components/modal/modal-image/modal-image.element';
import { ModalConfirm } from '~/components/modal/modal-confirm/modal-confirm';
import { useSnackbar } from '~/hooks/use-snackbar/use-snackbar';

const ReviewList: React.FC = () => {
  const [review, setReview] = useState<Review[]>([]);
  const { palette } = useTheme();
  const [open, setOpen] = useState(false);
  const [modalSrc, setModalSrc] = useState('');
  const [openConfirm, setOpenConfirm] = useState(false);
  const [comment, setComment] = useState<number | null>(null);
  const { snackbar } = useSnackbar();

  useEffect(() => {
    (async () => {
      const res = await reviewApi.getReviews();
      setReview(res);
    })();
  }, []);

  const handleConfirmDelete = async () => {
    if (comment === null) return;
    await reviewApi.deleteReview(comment);
    setReview((prev) => prev.filter((rev) => rev.id !== comment));
    setOpenConfirm(false);
    setComment(null);
    snackbar('success', "Xóa đánh giá thành công");
  }

  const columns = [
    { id: 'index', label: 'Mã đơn hàng' },
    { id: 'name', label: 'Sản phẩm', width: 200 },
    { id: 'slug', label: 'Đánh giá' },
    { id: 'translations', label: 'Nội dung' },
    { id: 'action', label: 'Action', width: 160 },
  ];

  return (
    <React.Fragment>
      <TableElement
        columns={columns}
        rows={review}
        renderRow={(rev, idx) => {
          return (
            <TableRow hover key={idx}>
              <TableCell>
                <Typography sx={{ textAlign: 'center' }}>{rev.order_item?.order?.code}</Typography>
              </TableCell>
              <TableCell>
                <Typography>{rev.product?.product_translations[0]?.name}</Typography>
              </TableCell>

              <TableCell>
                <Stack alignItems="center">
                  <Rating name="read-only" size="small" value={rev.rating} readOnly />
                  <Typography variant="caption">{rev.rating}/5</Typography>
                </Stack>
              </TableCell>

              <TableCell>
                <Typography>{rev.comment}</Typography>
                <StackRow gap={1} mt={1}>
                  {rev.images.map((img, imgIdx) => (
                    <Box
                      key={imgIdx}
                      component="img"
                      src={`${process.env.REACT_APP_BASE}storage/${img}`}
                      alt={`review-${imgIdx}`}
                      sx={{
                        width: 80,
                        height: 80,
                        objectFit: 'cover',
                        cursor: 'pointer',
                        borderRadius: 1,
                        border: `1px solid ${palette.background.paper}`,
                      }}
                      onClick={() => {
                        setModalSrc(`${process.env.REACT_APP_BASE}storage/${img}`);
                        setOpen(true);
                      }}
                    />
                  ))}
                </StackRow>
              </TableCell>

              <TableCell sx={{ position: 'sticky', right: 0, backgroundColor: 'background.default', textAlign: 'center' }}>
                <Tooltip title="Xóa">
                  <IconButton onClick={() => {setOpenConfirm(true); setComment(rev.id ?? null);}}>
                    <DeleteOutline />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          );
        }}
      />
      <ModalImage open={open} onClose={() => setOpen(false)} src={modalSrc} alt="Sản phẩm" />

      <ModalConfirm
        open={openConfirm}
        title="Xóa sản phẩm"
        message={`Bạn có chắc muốn xóa đánh giá không?`}
        onClose={() => setOpenConfirm(false)}
        onConfirm={handleConfirmDelete}
        // loading={loadingDelete}
      />
    </React.Fragment>
  );
};

export default ReviewList;
