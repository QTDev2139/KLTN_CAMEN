import { BlogCategory } from './blog-categories.state';
import TableElement from '~/components/elements/table-element/table-element';
import { StackRowJustCenter } from '~/components/elements/styles/stack.style';
import { TableRow, TableCell, IconButton, Tooltip, Typography } from '@mui/material';
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined';
import { ModeEditOutlineOutlined, DeleteOutline } from '@mui/icons-material';
import React from 'react';
import { ModalConfirm } from '~/components/modal/modal-confirm/modal-confirm';

type Props = {
  categories: BlogCategory[];
  onView: (c: BlogCategory) => void;
  onEdit: (c: BlogCategory) => void;
  onDelete: (c: BlogCategory) => void;
};

export default function BlogCategoriesList({ categories, onView, onEdit, onDelete }: Props) {
  const [openConfirm, setOpenConfirm] = React.useState(false);
  const [selected, setSelected] = React.useState<BlogCategory | null>(null);
  const columns = [
    { id: 'index', label: 'STT', width: 10 },
    { id: 'name', label: 'Tên (mặc định)', width: 300 },
    { id: 'slug', label: 'Slug (mặc định)', width: 240 },
    { id: 'translations', label: 'Số bản dịch', width: 120 },
    { id: 'action', label: 'Action', width: 160 },
  ];

  return (
    <React.Fragment>
      <TableElement
        columns={columns}
        rows={categories}
        renderRow={(cat, idx) => {
          const first = cat.post_category_translations?.[0] ?? { name: '-', slug: '-' };
          return (
            <TableRow hover key={cat.id}>
              <TableCell>
                <Typography sx={{ textAlign: 'center' }}>{idx + 1}</Typography>
              </TableCell>
              <TableCell>
                <Typography>{first.name}</Typography>
              </TableCell>

              <TableCell>
                <Typography>{first.slug}</Typography>
              </TableCell>

              <TableCell>
                <Typography>{cat.post_category_translations?.length ?? 0}</Typography>
              </TableCell>

              <TableCell sx={{ position: 'sticky', right: 0, backgroundColor: 'background.default' }}>
                <StackRowJustCenter sx={{ width: '100%', cursor: 'pointer' }}>
                  <Tooltip title="Xem">
                    <IconButton size="small" onClick={() => onView(cat)}>
                      <VisibilityOutlined fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Sửa">
                    <IconButton size="small" onClick={() => onEdit(cat)}>
                      <ModeEditOutlineOutlined fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Xóa">
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSelected(cat);
                        setOpenConfirm(true);
                      }}
                    >
                      <DeleteOutline fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </StackRowJustCenter>
              </TableCell>
            </TableRow>
          );
        }}
      />
      <ModalConfirm
        open={openConfirm}
        title="Xóa liên hệ"
        message={`Bạn có chắc muốn xóa liên hệ của "${selected?.post_category_translations?.[0]?.name}" không?`}
        onClose={() => setOpenConfirm(false)}
        onConfirm={() => {
          if (selected) {
            onDelete(selected);
            setOpenConfirm(false);
            setSelected(null);
          }
        }}
      />
    </React.Fragment>
  );
}
