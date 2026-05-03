import { DeleteOutline, ModeEditOutlineOutlined, VisibilityOutlined } from '@mui/icons-material';
import {
  IconButton,
  TableCell,
  TableRow,
  Tooltip,
  Box,
  Pagination,
  Drawer,
  Stack,
  Typography,
  Divider,
  Rating,
} from '@mui/material';
import React, { useEffect, useState, useMemo } from 'react';
import { productApi } from '~/apis';
import { Product, ProductDetail } from '~/apis/product/product.interface.api';
import { FormatPrice } from '~/components/elements/format-price/format-price.element';
import { StackRowJustCenter } from '~/components/elements/styles/stack.style';
import TableElement from '~/components/elements/table-element/table-element';
import { ModalConfirm } from '~/components/modal/modal-confirm/modal-confirm';
import { useProfile } from '~/hooks/use-profile/use-profile.hook';
import { useSnackbar } from '~/hooks/use-snackbar/use-snackbar';

type ListProductProps = {
  onEdit: (product: ProductDetail) => void;
  filterType: 'domestic' | 'export';
  searchName: string;
};

const ListProduct: React.FC<ListProductProps> = ({ onEdit, filterType, searchName }) => {
  const [listProduct, setListProduct] = useState<Product[]>([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const { snackbar } = useSnackbar();
  const { profile } = useProfile();
  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 7;

  // Drawer state
  const [openDrawer, setOpenDrawer] = useState(false);
  const [detailProduct, setDetailProduct] = useState<ProductDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

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

  const handleViewClick = async (id: number) => {
    setLoadingDetail(true);
    try {
      const detail = await productApi.getDetailProductById(id);
      setDetailProduct(detail);
      setOpenDrawer(true);
    } catch (e) {
      console.error(e);
      snackbar('error', 'Không tải được chi tiết sản phẩm');
    } finally {
      setLoadingDetail(false);
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
    if (!searchName) return listProduct;
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

  // Reset to first page when search name changes
  useEffect(() => {
    setCurrentPage(1);
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
                  <Tooltip title="Xem">
                    <IconButton onClick={() => handleViewClick(product.id)}>
                      <VisibilityOutlined />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Sửa">
                    <IconButton
                      onClick={() => handleEditClick(product.id)}
                      disabled={profile?.role?.name === 'staff'}
                    >
                      <ModeEditOutlineOutlined />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Xóa">
                    <IconButton onClick={() => handleOpenConfirm(product)} disabled={profile?.role?.name === 'staff'}>
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

      {/* Drawer for viewing product details */}
      <Drawer
        anchor="right"
        open={openDrawer}
        onClose={() => {
          setOpenDrawer(false);
          setDetailProduct(null);
        }}
      >
        <Box sx={{ width: 650, p: 3 }}>
          {detailProduct ? (
            <Stack spacing={2}>
              <Typography variant="h6">Chi tiết sản phẩm</Typography>
              <Divider />

              {/* Product Image */}
              <Box>
                <img
                  src={detailProduct.product_images?.[0]?.image_url}
                  alt="Product"
                  style={{ width: '100%', height: 'auto', borderRadius: 8 }}
                />
              </Box>

              {/* Product Name */}
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Tên sản phẩm
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {detailProduct.product_translations?.[0]?.name}
                </Typography>
              </Box>

              {/* Description */}
              {detailProduct.product_translations?.[0]?.description && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Mô tả
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {detailProduct.product_translations[0].description}
                  </Typography>
                </Box>
              )}

              {/* Price */}
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Giá bán
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, color: 'primary.main' }}>
                  {detailProduct.price ? FormatPrice(detailProduct.price) : '-'}
                </Typography>
              </Box>

              {/* Stock Quantity */}
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Số lượng tồn kho
                </Typography>
                <Typography variant="body1">{detailProduct.stock_quantity ?? '-'}</Typography>
              </Box>

              {/* Category */}
              {detailProduct.category && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Danh mục
                  </Typography>
                  <Typography variant="body2">{detailProduct.category?.translations?.[0]?.name}</Typography>
                </Box>
              )}

              {/* Nutrition Info */}
              {detailProduct.product_translations?.[0]?.nutrition_info && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Thông tin dinh dưỡng
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5, whiteSpace: 'pre-wrap', overflowWrap: 'break-word' }}>
                    <div dangerouslySetInnerHTML={{ __html: detailProduct.product_translations[0].nutrition_info }} />
                  </Typography>
                </Box>
              )}

              {/* Usage Instruction */}
              {detailProduct.product_translations?.[0]?.usage_instruction && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Hướng dẫn sử dụng
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5, whiteSpace: 'pre-wrap', overflowWrap: 'break-word' }}>
                    <div
                      dangerouslySetInnerHTML={{ __html: detailProduct.product_translations[0].usage_instruction }}
                    />
                  </Typography>
                </Box>
              )}

              {/* Reason to Choose */}
              {detailProduct.product_translations?.[0]?.reason_to_choose && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Lý do nên chọn
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5, whiteSpace: 'pre-wrap', overflowWrap: 'break-word' }}>
                    <div dangerouslySetInnerHTML={{ __html: detailProduct.product_translations[0].reason_to_choose }} />
                  </Typography>
                </Box>
              )}

              {/* Rating */}
              {detailProduct.average_rating && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Đánh giá
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
                    <Rating value={detailProduct.average_rating} readOnly size="small" />
                    <Typography variant="body2">{Number(detailProduct.average_rating).toFixed(1)}/5</Typography>
                  </Stack>
                </Box>
              )}

              {/* Status */}
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Trạng thái
                </Typography>
                <Typography variant="body2">{detailProduct.is_active ? 'Hoạt động' : 'Không hoạt động'}</Typography>
              </Box>
            </Stack>
          ) : (
            <Typography>Đang tải...</Typography>
          )}
        </Box>
      </Drawer>

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
