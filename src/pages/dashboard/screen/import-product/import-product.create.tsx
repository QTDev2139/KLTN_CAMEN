import {
  TableCell,
  TableRow,
  TextField,
  Box,
  Stack,
  Typography,
  Button,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { productApi } from '~/apis';
import { Product } from '~/apis/product/product.interface.api';
import { StackRowJustBetween } from '~/components/elements/styles/stack.style';
import TableElement from '~/components/elements/table-element/table-element';
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
        .filter(i => i.quantity > 0);

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
        result.forEach(p => {
          const id = (p as any).id as number;
          defaultQty[id] = 0;
        });

        // merge initial items (when editing) into defaults
        if (initial?.quantity_imports && initial.quantity_imports.length) {
          initial.quantity_imports.forEach(it => {
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

  const columns = [
    { id: 'code', label: 'STT' },
    { id: 'title', label: 'Tên sản phẩm' },
    { id: 'image', label: 'Hình ảnh' },
    { id: 'qty', label: 'Số lượng tồn kho' },
    { id: 'qty2', label: 'Số lượng cần nhập' },
  ];

  const handleQtyChange = (productId: number, value: string) => {
    const parsed = value === '' ? 0 : Math.max(0, parseInt(value || '0', 10));
    formik.setFieldValue(`quantities.${productId}`, isNaN(parsed) ? 0 : parsed);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <TableElement
        columns={columns}
        rows={listProduct}
        renderRow={(product, index) => {
          const id = (product as any).id as number;
          const value = formik.values.quantities?.[id] ?? 0; // default 0
          return (
            <TableRow hover key={index}>
              <TableCell sx={{ textAlign: 'center' }}>{index + 1}</TableCell>
              <TableCell>{product.product_translations[0].name}</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>
                <img src={product.product_images[0].image_url} alt="Product" style={{ width: '100px', height: '60px' }} />
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
                  onChange={e => handleQtyChange(id, e.target.value)}
                />
              </TableCell>
            </TableRow>
          );
        }}
      />
      <StackRowJustBetween
        sx={{ position: 'absolute', bottom: 20, width: 'calc(100% - 400px)', backgroundColor: '#fff', boxShadow: '0 -5px 10px #cecece', padding: '10px 20px' }}
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
            onChange={e => formik.setFieldValue('note', e.target.value)}
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
              ? (formik.isSubmitting ? 'Đang cập nhật...' : 'Cập nhật yêu cầu')
              : (formik.isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu')}
          </Button>
        </Box>
      </StackRowJustBetween>
    </form>
  );
};
export default CreateImportProduct;
