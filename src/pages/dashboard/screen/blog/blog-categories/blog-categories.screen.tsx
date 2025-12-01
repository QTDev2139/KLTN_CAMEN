import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useBlogCategoriesState, BlogCategory, PostCategoryTranslation } from './blog-categories.state';
import BlogCategoriesList from './blog-categories.list';
import BlogCategoriesForm from './blog-categories.form';
import { useSnackbar } from '~/hooks/use-snackbar/use-snackbar';
import { Divider, Stack, useTheme } from '@mui/material';

export default function BlogCategoriesScreen() {
  const {
    categories,
    modalMode,
    selected,
    openAdd,
    openView,
    openEdit,
    closeModal,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useBlogCategoriesState();

  const { snackbar } = useSnackbar();
  const { palette } = useTheme();

  async function handleSave(payload: { post_category_translations: PostCategoryTranslation[] }) {
    try {
      if (modalMode === 'add') {
        addCategory(payload);
        snackbar('success', 'Thêm danh mục bài viết thành công');
        closeModal();
        return;
      }
      if (modalMode === 'edit' && selected) {
        updateCategory(selected.id, payload);
        snackbar('success', 'Cập nhật danh mục bài viết thành công');
        closeModal();
        return;
      }
    } catch (err: any) {
      snackbar('error', err?.message || 'Có lỗi xảy ra');
    }
  }

  function handleDelete(cat: BlogCategory) {
    deleteCategory(cat.id);
    snackbar('success', 'Xóa danh mục bài viết thành công');
  }

  return (
    <Stack spacing={2}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h3">Quản lý danh mục bài viết</Typography>
        <Button onClick={openAdd}>
          <Typography variant="subtitle2">Thêm danh mục bài viết mới</Typography>
        </Button>
      </Box>
      <Divider sx={{ color: palette.divider }} />

      <BlogCategoriesList categories={categories} onView={openView} onEdit={openEdit} onDelete={handleDelete} />

      <BlogCategoriesForm
        open={!!modalMode}
        mode={modalMode}
        initial={selected ?? null}
        onClose={closeModal}
        onSave={handleSave}
      />
    </Stack>
  );
}
