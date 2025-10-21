import { DeleteOutline, ModeEditOutlineOutlined } from '@mui/icons-material';
import { IconButton, TableCell, TableRow, Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { productApi } from '~/apis';
import { Product } from '~/apis/product/product.interface.api';
import { StackRowJustCenter } from '~/components/elements/styles/stack.style';
import TableElement from '~/components/elements/table-element/table-element';
import { ModalConfirm } from '~/components/modal-confirm/modal-confirm';

type ListProductProps = {
  onUpdate: (product: Product) => void;
};

const ListProduct: React.FC<ListProductProps> = ({ onUpdate }) => {
  const [listProduct, setListProduct] = useState<Product[]>([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const handleOpenConfirm = (product: Product) => {
    setSelectedProduct(product);
    setOpenConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedProduct) return;
    setLoadingDelete(true);
    try {
      await productApi.deleteProduct(selectedProduct.id);
      setListProduct((prev) => prev.filter((p) => p.id !== selectedProduct.id));
    } catch (error) {
      console.error(error);
      alert('Xóa thất bại!');
    } finally {
      setLoadingDelete(false);
      setOpenConfirm(false);
    }
  };

  useEffect(() => {
    const fetchListProduct = async () => {
      const result = await productApi.getProduct('vi');
      setListProduct(result);
    };
    fetchListProduct();
  }, []);

  const columns = [
    { id: 'image', label: 'Ảnh' },
    { id: 'title', label: 'Tên sản phẩm' },
    { id: 'qty', label: 'Tồn kho' },
    { id: 'category', label: 'Danh mục' },
    { id: 'action', label: 'Action' },
  ];

  return (
    <React.Fragment>
      <TableElement
        columns={columns}
        rows={listProduct}
        renderRow={(product, index) => (
          <TableRow hover key={index}>
            <TableCell sx={{ textAlign: 'center' }}>
              <img src={product.product_images[0].image_url} alt="Product" style={{ width: '100px', height: '60px' }} />
            </TableCell>
            <TableCell>{product.product_translations[0].name}</TableCell>
            <TableCell sx={{ textAlign: 'center' }}>{product.stock_quantity}</TableCell>
            <TableCell sx={{ textAlign: 'center' }}>{product.category_id}</TableCell>
            <TableCell>
              <StackRowJustCenter sx={{ width: '100%', cursor: 'pointer' }}>
                <Tooltip title="Sửa">
                  <IconButton>
                    <ModeEditOutlineOutlined onClick={() => onUpdate(product)} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Xóa">
                  <IconButton>
                    <DeleteOutline onClick={() => handleOpenConfirm(product)} />
                  </IconButton>
                </Tooltip>
              </StackRowJustCenter>
            </TableCell>
          </TableRow>
        )}
      />
      <ModalConfirm
        open={openConfirm}
        title="Xóa sản phẩm"
        message={`Bạn có chắc muốn xóa "${selectedProduct?.product_translations?.[0]?.name}" không?`}
        onClose={() => setOpenConfirm(false)}
        onConfirm={handleConfirmDelete}
        loading={loadingDelete}
      />
    </React.Fragment>
  );
};
export default ListProduct;
