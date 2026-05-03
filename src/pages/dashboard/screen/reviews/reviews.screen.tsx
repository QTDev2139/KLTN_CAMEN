import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Divider, Stack, useTheme, TextField, Rating, FormGroup, FormControlLabel, Checkbox, Popover, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ReviewList from './reviews.list';
import { StackRowAlignCenter } from '~/components/elements/styles/stack.style';

const BlogCategoriesScreen: React.FC = () => {
  const { palette } = useTheme();
  const [searchProduct, setSearchProduct] = useState<string>('');
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const handleRatingToggle = (rating: number) => {
    setSelectedRatings((prev) =>
      prev.includes(rating) ? prev.filter((r) => r !== rating) : [...prev, rating]
    );
  };

  const handleClearRatings = () => {
    setSelectedRatings([]);
  };

  const open = Boolean(anchorEl);

  return (
    <Stack spacing={2}>
      <StackRowAlignCenter sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h3">Quản lý đánh giá</Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            placeholder="Tìm kiếm theo tên sản phẩm..."
            size="small"
            variant="outlined"
            value={searchProduct}
            onChange={(e) => setSearchProduct(e.target.value)}
            sx={{ minWidth: 280 }}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
            }}
          />
          <Button
            variant={selectedRatings.length > 0 ? 'contained' : 'outlined'}
            startIcon={<FilterListIcon />}
            onClick={handleFilterClick}
            sx={{
              textTransform: 'none',
            }}
          >
            Số sao {selectedRatings.length > 0 ? `(${selectedRatings.length})` : ''}
          </Button>
        </Stack>
      </StackRowAlignCenter>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleFilterClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box sx={{ p: 2, minWidth: 250 }}>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
            Lọc theo số sao
          </Typography>
          <FormGroup>
            {[5, 4, 3, 2, 1].map((rating) => (
              <FormControlLabel
                key={rating}
                control={
                  <Checkbox
                    checked={selectedRatings.includes(rating)}
                    onChange={() => handleRatingToggle(rating)}
                  />
                }
                label={
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Rating value={rating} readOnly size="small" />
                    <Typography variant="body2">({rating} sao)</Typography>
                  </Stack>
                }
              />
            ))}
          </FormGroup>
          {selectedRatings.length > 0 && (
            <Button
              fullWidth
              variant="text"
              size="small"
              onClick={handleClearRatings}
              sx={{ mt: 2 }}
            >
              Xóa bộ lọc
            </Button>
          )}
        </Box>
      </Popover>

      <Divider sx={{ color: palette.divider }} />

      <ReviewList searchProduct={searchProduct} selectedRatings={selectedRatings} />
    </Stack>
  );
};

export default BlogCategoriesScreen;
