import { 
  TableCell, 
  TableRow, 
  TextField, 
  Box, 
  Stack, 
  Typography, 
  Button,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  Paper
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { productApi } from '~/apis';
import { Product } from '~/apis/product/product.interface.api';
import { StackRowJustBetween } from '~/components/elements/styles/stack.style';
import { useSnackbar } from '~/hooks/use-snackbar/use-snackbar';
import { RequestImportPayload } from '~/apis/request-import/request-import.interface.api';
import { createImportRequestPayload, updateImportRequest } from '~/apis/request-import/request-import.api';

type CreateImportProductProps = {
  onSuccess?: () => void;
  initial?: RequestImportPayload | undefined;
};

const CreateImportProduct: React.FC<CreateImportProductProps> = ({ onSuccess, initial }) => {
  const [listProduct, setListProduct] = useState<Product[]>([]);
  const { snackbar } = useSnackbar();
  const [loadingProducts, setLoadingProducts] = useState(false);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      note: initial?.note ?? '',
      quantities: {} as Record<number, number>,
    },
    onSubmit: async (values, helpers) => {
      const items = Object.entries(values.quantities)
        .map(([k, v]) => ({ product_id: Number(k), quantity: Number(v) }))
        .filter((i) => i.quantity > 0);

      if (items.length === 0) {
        snackbar('warning', 'Vui lòng nhập số lượng cho ít nhất 1 sản phẩm');
        helpers.setSubmitting(false);
        return;
      }

      const payload: RequestImportPayload = {
        note: values.note || null,
        items,
      };

      try {
        if (initial && (initial as any).id) {
          await updateImportRequest((initial as any).id, payload);
          snackbar('success', 'Cập nhật yêu cầu nhập hàng thành công');
        } else {
          await createImportRequestPayload(payload);
          snackbar('success', 'Gửi yêu cầu nhập hàng thành công');
        }
        // reset
        helpers.resetForm();
        onSuccess && onSuccess();
      } catch (err) {
        console.error(err);
        snackbar('error', 'Gửi yêu cầu thất bại');
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    const fetchListProduct = async () => {
      try {
        setLoadingProducts(true);
        const result = await productApi.getProduct('vi', 'domestic');
        setListProduct(result);

        // prepare default quantities for all products (0)
        const defaultQty: Record<number, number> = {};
        result.forEach((p) => {
          const id = (p as any).id as number;
          defaultQty[id] = 0;
        });

        // merge initial items (when editing) into defaults
        if (initial?.quantity_imports && initial.quantity_imports.length) {
          initial.quantity_imports.forEach((it) => {
            defaultQty[it.product_id] = it.quantity;
          });
        }
        // ensure formik gets both note and quantities from initial
        formik.setValues({
          ...formik.values,
          note: initial?.note ?? formik.values.note,
          quantities: defaultQty,
        });
      } catch (e) {
        console.error(e);
        snackbar('error', 'Không tải được danh sách sản phẩm');
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchListProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial]);

  const handleQtyChange = (productId: number, value: string) => {
    const parsed = value === '' ? 0 : Math.max(0, parseInt(value || '0', 10));
    formik.setFieldValue(`quantities.${productId}`, isNaN(parsed) ? 0 : parsed);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <TableContainer 
        component={Paper}
        sx={{ maxHeight: '500px', overflowY: 'auto', overflowX: 'hidden', mb: 12 }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'background.paper' }}>
              <TableCell sx={{ textAlign: 'center', fontWeight: 'bold' }}>STT</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Tên sản phẩm</TableCell>
              <TableCell sx={{ textAlign: 'center', fontWeight: 'bold' }}>Hình ảnh</TableCell>
              <TableCell sx={{ textAlign: 'center', fontWeight: 'bold' }}>Số lượng tồn kho</TableCell>
              <TableCell sx={{ textAlign: 'center', fontWeight: 'bold' }}>Số lượng cần nhập</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listProduct.map((product, index) => {
              const id = (product as any).id as number;
              const value = formik.values.quantities?.[id] ?? 0;
              return (
                <TableRow hover key={index}>
                  <TableCell sx={{ textAlign: 'center' }}>{index + 1}</TableCell>
                  <TableCell>{product.product_translations[0].name}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <img
                      src={product.product_images[0].image_url}
                      alt="Product"
                      style={{ width: '100px', height: '60px', objectFit: 'cover' }}
                    />
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    {product.stock_quantity == null ? '-' : product.stock_quantity}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <TextField
                      type="number"
                      size="small"
                      inputProps={{ min: 0 }}
                      value={value}
                      onChange={(e) => handleQtyChange(id, e.target.value)}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      
      <StackRowJustBetween
        sx={{
          position: 'absolute',
          bottom: 20,
          width: 'calc(100% - 390px)',
          backgroundColor: '#fff',
          boxShadow: '0 -5px 10px #cecece',
          padding: '10px 20px',
        }}
      >
        <Stack sx={{ width: '400px' }}>
          <Typography variant="subtitle2">Ghi chú</Typography>
          <TextField
            multiline
            minRows={2}
            maxRows={4}
            fullWidth
            name="note"
            value={formik.values.note}
            onChange={(e) => formik.setFieldValue('note', e.target.value)}
          />
        </Stack>
        <Box>
          <Button
            sx={{ height: '40px', mt: '30px' }}
            variant="contained"
            color="primary"
            type="submit"
            disabled={formik.isSubmitting || loadingProducts}
          >
            {initial
              ? formik.isSubmitting
                ? 'Cập nhật yêu cầu'
                : 'Cập nhật yêu cầu'
              : formik.isSubmitting
              ? 'Gửi yêu cầu'
              : 'Gửi yêu cầu'}
          </Button>
        </Box>
      </StackRowJustBetween>
    </form>
  );
};
export default CreateImportProduct;
