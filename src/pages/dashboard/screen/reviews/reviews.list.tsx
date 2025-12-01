import TableElement from '~/components/elements/table-element/table-element';
import { StackRow, StackRowJustCenter } from '~/components/elements/styles/stack.style';
import { TableRow, TableCell, IconButton, Tooltip, Typography, Rating, Stack, Box, useTheme } from '@mui/material';
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined';
import { ModeEditOutlineOutlined, DeleteOutline, ArrowForwardIosOutlined } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { ModalConfirm } from '~/components/modal/modal-confirm/modal-confirm';
import { reviewApi } from '~/apis';
import { Review } from '~/apis/review/review.interface.api';
import ModalImage from '~/components/modal/modal-image/modal-image.element';

const ReviewList: React.FC = () => {
  const [review, setReview] = useState<Review[]>([]);
  const { palette } = useTheme();
  const [open, setOpen] = useState(false);
  const [modalSrc, setModalSrc] = useState('');

  useEffect(() => {
    (async () => {
      const res = await reviewApi.getReviews();
      console.log(res);
      setReview(res);
    })();
  }, []);

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

              <TableCell sx={{ position: 'sticky', right: 0, backgroundColor: 'background.default' }}>
                <StackRow gap={1} sx={{ cursor: 'pointer' }}>
                  <Typography>Trả lời</Typography>
                  <ArrowForwardIosOutlined fontSize="small" />
                </StackRow>
              </TableCell>
            </TableRow>
          );
        }}
      />
      <ModalImage open={open} onClose={() => setOpen(false)} src={modalSrc} alt="Sản phẩm" />
    </React.Fragment>
  );
};

export default ReviewList;
