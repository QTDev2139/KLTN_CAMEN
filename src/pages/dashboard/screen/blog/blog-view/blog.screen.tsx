import { Button, Divider, Stack, Typography, useTheme } from '@mui/material';
import { useState } from 'react';
import { StackRowAlignCenter } from '~/components/elements/styles/stack.style';

import ListBlog from './list-blog';
import CreateBlog from './create-blog';
import { BlogMode } from './blog.enum';
import type { Post } from '~/apis/blog/blog.interface.api';

export default function BlogScreen() {
  const { palette } = useTheme();

  const [mode, setMode] = useState<BlogMode>(BlogMode.LIST);
  const [selected, setSelected] = useState<Post | null>(null);

  const goList = () => {
    setSelected(null);
    setMode(BlogMode.LIST);
  };
  const goCreate = () => {
    setSelected(null);
    setMode(BlogMode.CREATE);
  };
  const goUpdate = (post: Post) => {
    setSelected(post);
    setMode(BlogMode.UPDATE);
  };

  return (
    <Stack spacing={2}>
      <StackRowAlignCenter sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h3">Quản lý bài viết</Typography>
        {mode === BlogMode.LIST && (
          <Button onClick={goCreate}>
            <Typography variant="subtitle2">Thêm bài viết mới</Typography>
          </Button>
        )}
        {(mode === BlogMode.CREATE || mode === BlogMode.UPDATE) && (
          <Button onClick={goList}>
            <Typography variant="subtitle2">Quay Lại</Typography>
          </Button>
        )}
      </StackRowAlignCenter>

      <Divider sx={{ color: palette.divider }} />

      {mode === BlogMode.LIST && <ListBlog onUpdate={goUpdate} />}
      {(mode === BlogMode.CREATE || mode === BlogMode.UPDATE) && (
        <CreateBlog initial={selected ?? undefined} onSuccess={goList} />
      )}
    </Stack>
  );
}
