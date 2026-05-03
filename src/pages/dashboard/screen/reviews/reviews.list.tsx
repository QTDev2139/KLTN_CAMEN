import TableElement from '~/components/elements/table-element/table-element';
import { StackRow, StackRowJustCenter } from '~/components/elements/styles/stack.style';
import { TableRow, TableCell, Typography, Rating, Stack, Box, useTheme, Tooltip, IconButton, Pagination } from '@mui/material';
import { DeleteOutline } from '@mui/icons-material';
import React, { useEffect, useState, useMemo } from 'react';
import { reviewApi } from '~/apis';
import { Review } from '~/apis/review/review.interface.api';
import ModalImage from '~/components/modal/modal-image/modal-image.element';
import { ModalConfirm } from '~/components/modal/modal-confirm/modal-confirm';
import { useSnackbar } from '~/hooks/use-snackbar/use-snackbar';
import { useProfile } from '~/hooks/use-profile/use-profile.hook';

const REVIEWS_PER_PAGE = 6;

interface ReviewListProps {
  searchProduct: string;
  selectedRatings: number[];
}

const ReviewList: React.FC<ReviewListProps> = ({ searchProduct, selectedRatings }) => {
  const [review, setReview] = useState<Review[]>([]);
  const { palette } = useTheme();
  const [open, setOpen] = useState(false);
  const [modalSrc, setModalSrc] = useState('');
  const [openConfirm, setOpenConfirm] = useState(false);
  const [comment, setComment] = useState<number | null>(null);
  const { snackbar } = useSnackbar();
  const [currentPage, setCurrentPage] = useState(1);
  const { profile } = useProfile();

  useEffect(() => {
    (async () => {
      const res = await reviewApi.getReviews();
      setReview(res);
      setCurrentPage(1); // Reset pagination when fetching new data
    })();
  }, []);

  // Filter reviews by product name and rating
  const filteredReviews = useMemo(() => {
    let filtered = review;

    // Filter by product name
    if (searchProduct) {
      filtered = filtered.filter((rev) =>
        rev.product?.product_translations[0]?.name
          .toLowerCase()
          .includes(searchProduct.toLowerCase())
      );
    }

    // Filter by ratings
    if (selectedRatings.length > 0) {
      filtered = filtered.filter((rev) => selectedRatings.includes(rev.rating));
    }

    return filtered;
  }, [review, searchProduct, selectedRatings]);

  // Paginate filtered reviews
  const paginatedReviews = useMemo(() => {
    return filteredReviews.slice((currentPage - 1) * REVIEWS_PER_PAGE, currentPage * REVIEWS_PER_PAGE);
  }, [filteredReviews, currentPage]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchProduct, selectedRatings]);

  const handleConfirmDelete = async () => {
    if (comment === null) return;
    try {
      await reviewApi.deleteReview(comment);
      setReview((prev) => prev.filter((rev) => rev.id !== comment));
      setOpenConfirm(false);
      setComment(null);
      snackbar('success', "Xóa đánh giá thành công");
      setCurrentPage(1); // Reset pagination after delete
    } catch (error) {
      console.error('Delete review failed', error);
      snackbar('error', 'Xóa đánh giá thất bại');
    }
  };

  const columns = [
    { id: 'stt', label: 'STT' },
    { id: 'index', label: 'Mã đơn hàng' },
    { id: 'name', label: 'Sản phẩm', width: 200 },
    { id: 'slug', label: 'Đánh giá' },
    { id: 'translations', label: 'Nội dung' },
    { id: 'action', label: 'Action', width: 160 },
  ];

  return (
    <React.Fragment>
      <Box
        sx={{
          scrollbarGutter: 'stable',
          '&:has(table)': { overflowY: 'auto' },
        }}
      >
        <TableElement
          columns={columns}
          rows={paginatedReviews}
          renderRow={(rev, idx) => {
            return (
              <TableRow hover key={idx}>
                <TableCell>
                  <Typography sx={{ textAlign: 'center' }}>{(currentPage - 1) * REVIEWS_PER_PAGE + idx + 1}</Typography>
                </TableCell>
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
                    <span
                      style={{ display: 'inline-block' }}
                      onClick={() => {
                        setOpenConfirm(true);
                        setComment(rev.id ?? null);
                      }}
                    >
                      <IconButton disabled={profile?.role?.name === "staff"}>
                        <DeleteOutline />
                      </IconButton>
                    </span>
                  </Tooltip>
                </TableCell>
              </TableRow>
            );
          }}
        />
      </Box>

      {Math.ceil(filteredReviews.length / REVIEWS_PER_PAGE) > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={Math.ceil(filteredReviews.length / REVIEWS_PER_PAGE)}
            page={currentPage}
            variant="outlined"
            onChange={(event, value) => setCurrentPage(value)}
          />
        </Box>
      )}

      <ModalImage open={open} onClose={() => setOpen(false)} src={modalSrc} alt="Sản phẩm" />

      <ModalConfirm
        open={openConfirm}
        title="Xóa đánh giá"
        message={`Bạn có chắc muốn xóa đánh giá không?`}
        onClose={() => setOpenConfirm(false)}
        onConfirm={handleConfirmDelete}
      />
    </React.Fragment>
  );
};

export default ReviewList;
