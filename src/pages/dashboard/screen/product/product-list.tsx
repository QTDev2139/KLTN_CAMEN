import { DeleteOutline, ModeEditOutlineOutlined, Search as SearchIcon } from '@mui/icons-material';
import { IconButton, TableCell, TableRow, Tooltip, TextField, MenuItem, Box, Pagination } from '@mui/material';
import React, { useEffect, useState, useMemo } from 'react';
import { productApi } from '~/apis';
import { Product, ProductDetail } from '~/apis/product/product.interface.api';
import { FormatPrice } from '~/components/elements/format-price/format-price.element';
import { StackRowJustCenter } from '~/components/elements/styles/stack.style';
import TableElement from '~/components/elements/table-element/table-element';
import { ModalConfirm } from '~/components/modal/modal-confirm/modal-confirm';
import { useSnackbar } from '~/hooks/use-snackbar/use-snackbar';

type ListProductProps = {
  onEdit: (product: ProductDetail) => void;
};

const ListProduct: React.FC<ListProductProps> = ({ onEdit }) => {
  const [listProduct, setListProduct] = useState<Product[]>([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const { snackbar } = useSnackbar();
  // filter for product type: 'domestic' or 'export'
  const [filterType, setFilterType] = useState<'domestic' | 'export'>('domestic');
  const [searchName, setSearchName] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 7;

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
      snackbar('success', 'Xóa sản phẩm thành công');
      setCurrentPage(1); // Reset to first page after delete
    } catch (error) {
      console.error(error);
      snackbar('error', 'Xóa sản phẩm thất bại');
    } finally {
      setLoadingDelete(false);
      setOpenConfirm(false);
    }
  };

  const handleEditClick = async (id: number) => {
    try {
      const detail = await productApi.getDetailProductById(id);
      onEdit(detail);
    } catch (e) {
      console.error(e);
      snackbar('error', 'Không tải được chi tiết sản phẩm');
    }
  };

  // Filter products by search name
  const filteredProducts = useMemo(() => {
    return listProduct.filter((product) =>
      product.product_translations[0].name.toLowerCase().includes(searchName.toLowerCase()),
    );
  }, [listProduct, searchName]);

  // Paginate filtered products
  const paginatedProducts = useMemo(() => {
    return filteredProducts.slice((currentPage - 1) * PRODUCTS_PER_PAGE, currentPage * PRODUCTS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  useEffect(() => {
    const fetchListProduct = async () => {
      try {
        const result = await productApi.getProduct('vi', filterType);
        setListProduct(result);
        setCurrentPage(1); // Reset to first page when filter type changes
      } catch (e) {
        console.error(e);
        snackbar('error', 'Không tải được danh sách sản phẩm');
      }
    };
    fetchListProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterType]); // reload when filter type changes

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when search name changes
  }, [searchName]);

  const columns = [
    { id: 'code', label: 'STT' },
    { id: 'title', label: 'Tên sản phẩm' },
    { id: 'image', label: 'Hình ảnh' },
    { id: 'price', label: 'Giá bán' },
    { id: 'qty', label: 'Số lượng tồn kho' },
    { id: 'action', label: 'Action' },
  ];

  return (
    <React.Fragment>
      {/* Filter: domestic / export */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <TextField
          placeholder="Tìm kiếm theo tên sản phẩm..."
          size="small"
          variant="outlined"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          sx={{ minWidth: 200 }}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
          }}
        />
        <TextField
          sx={{ minWidth: 160 }}
          select
          size="small"
          label="Loại sản phẩm"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as 'domestic' | 'export')}
        >
          <MenuItem value="domestic">Nội địa</MenuItem>
          <MenuItem value="export">Xuất khẩu</MenuItem>
        </TextField>
      </Box>

      <Box
        sx={{
          scrollbarGutter: 'stable',
          '&:has(table)': { overflowY: 'auto' },
        }}
      >
        <TableElement
          columns={columns}
          rows={paginatedProducts}
          renderRow={(product, index) => (
            <TableRow hover key={product.id ?? index}>
              <TableCell sx={{ textAlign: 'center' }}>{(currentPage - 1) * PRODUCTS_PER_PAGE + index + 1}</TableCell>
              <TableCell>{product.product_translations[0].name}</TableCell>
              <TableCell sx={{ textAlign: 'center', padding: '0' }}>
                <img
                  src={product.product_images[0].image_url}
                  alt="Product"
                  style={{ width: '100px', height: '60px' }}
                />
              </TableCell>
              <TableCell sx={{ textAlign: 'center' }}>
                {product.price == null ? '-' : FormatPrice(product.price)}
              </TableCell>
              <TableCell sx={{ textAlign: 'center' }}>
                {product.stock_quantity == null ? '-' : product.stock_quantity}
              </TableCell>
              <TableCell>
                <StackRowJustCenter sx={{ width: '100%', cursor: 'pointer' }}>
                  <Tooltip title="Sửa">
                    <IconButton onClick={() => handleEditClick(product.id)}>
                      <ModeEditOutlineOutlined />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Xóa">
                    <IconButton onClick={() => handleOpenConfirm(product)}>
                      <DeleteOutline />
                    </IconButton>
                  </Tooltip>
                </StackRowJustCenter>
              </TableCell>
            </TableRow>
          )}
        />
      </Box>

      {Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE) > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)}
            page={currentPage}
            variant="outlined"
            onChange={(event, value) => setCurrentPage(value)}
          />
        </Box>
      )}

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
