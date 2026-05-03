import { IconButton, Stack, TableCell, TableRow, Tooltip, Typography, Box, Pagination } from '@mui/material';
import TableElement from '~/components/elements/table-element/table-element';
import { useEffect, useState, useMemo } from 'react';
import { getListBlog, deletePost } from '~/apis/blog/blog.api';
import { Post } from '~/apis/blog/blog.interface.api';
import { DeleteOutline, ModeEditOutlineOutlined } from '@mui/icons-material';
import { StackRowJustCenter } from '~/components/elements/styles/stack.style';
import { TagElement, type TagType } from '~/components/elements/tag/tag.element';
import { getLimitLineCss } from '~/common/until/get-limit-line-css';
import { useSnackbar } from '~/hooks/use-snackbar/use-snackbar';
import { ModalConfirm } from '~/components/modal/modal-confirm/modal-confirm';

const actionName: Record<number, string> = {
  0: "Không hoạt động",
  1: "Hoạt động",
}
const actionColor: Record<number, TagType> = {
  0: "error",
  1: "success",
}

const BLOGS_PER_PAGE = 7;

type ListBlogProps = {
  onUpdate: (post: Post) => void;
  searchTitle: string;
};

export default function ListBlog({ onUpdate, searchTitle }: ListBlogProps) {
  const [listBlog, setListBlog] = useState<Post[]>([]);
  const { snackbar } = useSnackbar();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selected, setSelected] = useState<Post | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetch = async () => {
    try {
      const result = await getListBlog();
      const items = Array.isArray(result) ? result : (result as any)?.post ?? (result as any)?.posts ?? [];
      setListBlog(items);
      setCurrentPage(1); // Reset pagination when fetching new data
    } catch (err) {
      console.error('fetch list blog failed', err);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  // Filter blogs by title
  const filteredBlogs = useMemo(() => {
    if (!searchTitle) return listBlog;
    return listBlog.filter((blog) =>
      (blog as any).title.toLowerCase().includes(searchTitle.toLowerCase())
    );
  }, [listBlog, searchTitle]);

  // Paginate filtered blogs
  const paginatedBlogs = useMemo(() => {
    return filteredBlogs.slice((currentPage - 1) * BLOGS_PER_PAGE, currentPage * BLOGS_PER_PAGE);
  }, [filteredBlogs, currentPage]);

  // Reset to first page when search title changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTitle]);

  const handleDelete = async (id: number) => {
    try {
      await deletePost(id);
      setListBlog((prev) => prev.filter((p) => p.id !== id));
      snackbar('success', 'Xóa bài viết thành công');
      setOpenConfirm(false);
      setSelected(null);
      setCurrentPage(1); // Reset pagination after delete
    } catch (err: any) {
      console.error('delete failed', err);
      snackbar('error', err?.message || 'Xóa thất bại');
    }
  };

  const columns = [
    { id: 'stt', label: 'STT', width: 60 },
    { id: 'category', label: 'Danh mục', width: 200 },
    { id: 'title', label: 'Tên bài viết'},
    { id: 'image', label: 'Ảnh', width: 200 },
    { id: 'user', label: 'Người đăng', width: 200 },
    { id: 'created_at', label: 'Ngày đăng', width: 200 },
    { id: 'action', label: 'Action' },
  ];

  return (
    <Stack>
      <Box
        sx={{
          scrollbarGutter: 'stable',
          '&:has(table)': { overflowY: 'auto' },
        }}
      >
        <TableElement
          columns={columns}
          rows={paginatedBlogs}
          renderRow={(blog, index) => (
            <TableRow hover key={index}>
              <TableCell sx={{ textAlign: 'center' }}>{(currentPage - 1) * BLOGS_PER_PAGE + index + 1}</TableCell>
              <TableCell>
                <Typography sx={{ ...getLimitLineCss(1) }}>
                  {(blog as any).post_category?.translations?.[0]?.name ?? ''}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ ...getLimitLineCss(1) }}>{(blog as any).title}</Typography>
              </TableCell>
              <TableCell sx={{ textAlign: 'center', padding: '4px 16px' }}>
                <img src={(blog as any).thumbnail} alt="Blog" style={{ width: '100px', height: '60px' }} />
              </TableCell>
              <TableCell sx={{ textAlign: 'center' }}>{(blog as any).user?.name}</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>{(blog as any).created_at}</TableCell>
              <TableCell sx={{ position: 'sticky', right: 0, backgroundColor: 'background.default' }}>
                <StackRowJustCenter sx={{ width: '100%', cursor: 'pointer' }}>
                  <Tooltip title="Sửa">
                    <IconButton size="small" onClick={() => onUpdate(blog)}>
                      <ModeEditOutlineOutlined fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Xóa">
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSelected(blog);
                        setOpenConfirm(true);
                      }}
                    >
                      <DeleteOutline />
                    </IconButton>
                  </Tooltip>
                </StackRowJustCenter>
              </TableCell>
            </TableRow>
          )}
        />
      </Box>

      {Math.ceil(filteredBlogs.length / BLOGS_PER_PAGE) > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={Math.ceil(filteredBlogs.length / BLOGS_PER_PAGE)}
            page={currentPage}
            variant="outlined"
            onChange={(event, value) => setCurrentPage(value)}
          />
        </Box>
      )}

      <ModalConfirm
        open={openConfirm}
        title="Xóa bài viết"
        message={`Bạn có chắc muốn xóa bài viết "${selected?.translations?.[0]?.title ?? (selected as any)?.title}" không?`}
        onClose={() => setOpenConfirm(false)}
        onConfirm={() => handleDelete(selected?.id!)}
      />
    </Stack>
  );
}
