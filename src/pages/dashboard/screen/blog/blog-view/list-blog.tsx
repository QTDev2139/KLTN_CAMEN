import { IconButton, Stack, TableCell, TableRow, Tooltip, Typography } from '@mui/material';
import TableElement from '~/components/elements/table-element/table-element';
import { useEffect, useState } from 'react';
import { getListBlog, deletePost } from '~/apis/blog/blog.api';
import { Post } from '~/apis/blog/blog.interface.api';
import { DeleteOutline, ModeEditOutlineOutlined } from '@mui/icons-material';
import { StackRowJustCenter } from '~/components/elements/styles/stack.style';
import { TagElement } from '~/components/elements/tag/tag.element';
import { getLimitLineCss } from '~/common/until/get-limit-line-css';
import { useSnackbar } from '~/hooks/use-snackbar/use-snackbar';

type ListBlogProps = {
  onUpdate: (post: Post) => void;
};
export default function ListBlog({ onUpdate }: ListBlogProps) {
  const [listBlog, setListBlog] = useState<Post[]>([]);
  const { snackbar } = useSnackbar();

  const fetch = async () => {
    try {
      const result = await getListBlog();
      const items = Array.isArray(result) ? result : (result as any)?.post ?? (result as any)?.posts ?? [];
      setListBlog(items);
    } catch (err) {
      console.error('fetch list blog failed', err);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleDelete = async (blog: Post) => {
    const ok = window.confirm(`Xóa bài viết "${(blog as any).title ?? blog.id}"? Hành động không thể hoàn tác.`);
    if (!ok) return;
    try {
      await deletePost(Number((blog as any).id));
      setListBlog((prev) => prev.filter((p) => String((p as any).id) !== String((blog as any).id)));
      snackbar('success', 'Xóa bài viết thành công');
    } catch (err: any) {
      console.error('delete failed', err);
      snackbar('error', err?.message || 'Xóa thất bại');
    }
  };

  const columns = [
    { id: 'stt', label: 'STT', width: 60 },
    { id: 'title', label: 'Danh mục', width: 200 },
    { id: 'title', label: 'Tên bài viết', width: 200 },
    { id: 'image', label: 'Ảnh', width: 200 },
    { id: 'user', label: 'Người đăng', width: 200 },
    { id: 'created_at', label: 'Ngày đăng', width: 200 },
    { id: 'status', label: 'Trạng thái', width: 100 },
    { id: 'action', label: 'Action' },
  ];

  return (
    <Stack>
      <TableElement
        columns={columns}
        rows={listBlog}
        renderRow={(blog, index) => (
          <TableRow hover key={index}>
            <TableCell sx={{ textAlign: 'center' }}>{index + 1}</TableCell>
            <TableCell>
              <Typography sx={{ ...getLimitLineCss(1) }}>{(blog as any).post_category?.translations?.[0]?.name ?? ''}</Typography>
            </TableCell>
            <TableCell>
              <Typography sx={{ ...getLimitLineCss(1) }}>{(blog as any).title}</Typography>
            </TableCell>
            <TableCell sx={{ textAlign: 'center' }}>
              <img src={(blog as any).thumbnail} alt="Blog" style={{ width: '100px', height: '60px' }} />
            </TableCell>
            <TableCell sx={{ textAlign: 'center' }}>{(blog as any).user?.name}</TableCell>
            <TableCell sx={{ textAlign: 'center' }}>{(blog as any).created_at}</TableCell>
            <TableCell sx={{ textAlign: 'center' }}>
              <TagElement
                type={(blog as any).status === 1 ? 'success' : 'error'}
                content={(blog as any).status === 1 ? 'Hoạt động' : 'Không hoạt động'}
              />
            </TableCell>
            <TableCell sx={{ position: 'sticky', right: 0, backgroundColor: 'background.default' }}>
              <StackRowJustCenter sx={{ width: '100%', cursor: 'pointer' }}>
                <Tooltip title="Sửa">
                  <IconButton size="small" onClick={() => onUpdate(blog)}>
                    <ModeEditOutlineOutlined fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Xóa">
                  <IconButton size="small" onClick={() => handleDelete(blog)}>
                    <DeleteOutline />
                  </IconButton>
                </Tooltip>
              </StackRowJustCenter>
            </TableCell>
          </TableRow>
        )}
      />
    </Stack>
  );
}
