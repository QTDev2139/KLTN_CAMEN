import { Button, Divider, Stack, Typography, useTheme } from "@mui/material";
import { StackRowAlignCenter } from "~/components/elements/styles/stack.style";
import { ProductMode } from "./product.enum";
import { useState } from "react";
import ListProduct from "./product-list";
import CreateProduct from "./product-create";
import { ProductDetail } from "~/apis/product/product.interface.api";

const ProductScreen: React.FC = () => {
  const { palette } = useTheme();
  const [mode, setMode] = useState<ProductMode>(ProductMode.LIST);
  const [editingProduct, setEditingProduct] = useState<ProductDetail | undefined>(undefined);

  const goList = () => {
    setEditingProduct(undefined);
    setMode(ProductMode.LIST);
  };
  
  const goCreate = () => {
    setEditingProduct(undefined);
    setMode(ProductMode.CREATE);
  };
  
  const goUpdate = (product: ProductDetail) => {
    setEditingProduct(product);
    setMode(ProductMode.UPDATE);
  };

  // const handleSubmit = async (values: ProductDetail) => {
  //   // Xử lý submit cho cả create và update
  //   console.log('Submit values:', values);
  //   // TODO: Gọi API tương ứng
  //   goList();
  // };

  return (
    <Stack spacing={2}>
      <StackRowAlignCenter sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h3">Quản lý sản phẩm</Typography>
        {mode === ProductMode.LIST && (
          <Button onClick={goCreate}>
            <Typography variant="subtitle2">Thêm sản phẩm mới</Typography>
          </Button>
        )}
        {(mode === ProductMode.CREATE || mode === ProductMode.UPDATE) && (
          <Button onClick={goList}>
            <Typography variant="subtitle2">Quay Lại</Typography>
          </Button>
        )}
      </StackRowAlignCenter>
      <Divider sx={{ color: palette.divider }} />
      
      {mode === ProductMode.LIST && <ListProduct onEdit={goUpdate} />}
      {mode === ProductMode.CREATE && <CreateProduct />}
      {mode === ProductMode.UPDATE && <CreateProduct initial={editingProduct} />}
    </Stack>
  );
}

export default ProductScreen;