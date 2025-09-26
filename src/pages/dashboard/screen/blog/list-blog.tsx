import { IconButton, TableCell, TableRow, Tooltip } from '@mui/material';
import TableElement from '~/components/elements/table-element/table-element';
import { useEffect, useState } from 'react';
import { blogApi } from '~/apis';
import { Post } from '~/apis/blog/blog.api.interface';
import { DeleteOutline, ModeEditOutlineOutlined } from '@mui/icons-material';
import { StackRowJustCenter } from '~/components/elements/styles/stack.style';

type ListBlogProps = {
  onUpdate: (post: Post) => void;
};
export default function ListBlog({ onUpdate }: ListBlogProps) {
  const [listBlog, setListBlog] = useState<Post[]>([]);

  useEffect(() => {
    const fetchListBlog = async () => {
      const result = await blogApi.getListBlog();
      setListBlog(result.post);
    };
    fetchListBlog();
  }, []);
  const listBlogVi = listBlog.filter((p) => p.language?.code === 'vi');

  const columns = [
    { id: 'title', label: 'Tiêu đề' },
    { id: 'user', label: 'Người đăng' },
    { id: 'created_at', label: 'Ngày đăng' },
    { id: 'image', label: 'Ảnh' },
    { id: 'action', label: 'Action' },
  ];

  return (
    <TableElement
      columns={columns}
      rows={listBlogVi}
      renderRow={(blog, index) => (
        <TableRow hover key={index}>
          <TableCell>{blog.title}</TableCell>
          <TableCell sx={{ textAlign: 'center' }}>{blog.user?.name}</TableCell>
          <TableCell sx={{ textAlign: 'center' }}>{blog.created_at}</TableCell>
          <TableCell sx={{ textAlign: 'center' }}>
            <img src={blog.thumbnail} alt="Blog" style={{ width: '100px', height: '60px' }}/>
          </TableCell>
          <TableCell>
            <StackRowJustCenter sx={{ width: '100%', cursor: 'pointer' }}>
              <Tooltip title="Sửa">
                <IconButton>
                  <ModeEditOutlineOutlined onClick={() => onUpdate(blog)} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Xóa">
                <IconButton>
                  <DeleteOutline />
                </IconButton>
              </Tooltip>
            </StackRowJustCenter>
          </TableCell>
        </TableRow>
      )}
    />
  );
}
