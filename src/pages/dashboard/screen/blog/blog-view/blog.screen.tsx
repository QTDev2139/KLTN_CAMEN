import { Button, Divider, Stack, Typography, useTheme, TextField } from '@mui/material';
import { useState } from 'react';
import { StackRowAlignCenter } from '~/components/elements/styles/stack.style';
import SearchIcon from '@mui/icons-material/Search';

import ListBlog from './list-blog';
import CreateBlog from './create-blog';
import { BlogMode } from './blog.enum';
import type { Post } from '~/apis/blog/blog.interface.api';

export default function BlogScreen() {
  const { palette } = useTheme();

  const [mode, setMode] = useState<BlogMode>(BlogMode.LIST);
  const [selected, setSelected] = useState<Post | null>(null);
  const [searchTitle, setSearchTitle] = useState<string>('');

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
        <Stack direction="row" spacing={2} alignItems="center">
          {mode === BlogMode.LIST && (
            <>
              <TextField
                placeholder="Tìm kiếm theo tên bài viết..."
                size="small"
                variant="outlined"
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
                sx={{ minWidth: 280 }}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
                }}
              />
              <Button onClick={goCreate} variant="outlined">
                <Typography variant="subtitle2">Thêm bài viết mới</Typography>
              </Button>
            </>
          )}
          {(mode === BlogMode.CREATE || mode === BlogMode.UPDATE) && (
            <Button onClick={goList} variant="outlined">
              <Typography variant="subtitle2">Quay Lại</Typography>
            </Button>
          )}
        </Stack>
      </StackRowAlignCenter>

      <Divider sx={{ color: palette.divider }} />

      {mode === BlogMode.LIST && <ListBlog onUpdate={goUpdate} searchTitle={searchTitle} />}
      {(mode === BlogMode.CREATE || mode === BlogMode.UPDATE) && (
        <CreateBlog initial={selected ?? undefined} onSuccess={goList} />
      )}
    </Stack>
  );
}
