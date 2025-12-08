import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Divider, Stack, useTheme } from '@mui/material';
import ReviewList from './reviews.list';

const BlogCategoriesScreen: React.FC = () => {
  const { palette } = useTheme();

  return (
    <Stack spacing={2}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h3">Quản lý đánh giá</Typography>
       
      </Box>
      <Divider sx={{ color: palette.divider }} />
      
      <ReviewList />
    </Stack>
  );
};

export default BlogCategoriesScreen;
