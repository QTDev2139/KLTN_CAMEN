import { Button, Divider, Stack, Typography, useTheme } from "@mui/material";
import { StackRowAlignCenter } from "~/components/elements/styles/stack.style";
import { ProductMode } from "./product.enum";
import { useState } from "react";
import ListProduct from "./product-list";
import CreateProduct from "./product-create";
import UpdateProduct from "./product-update";

const ProductScreen: React.FC = () => {
    const { palette } = useTheme();
  const [mode, setMode] = useState<ProductMode>(ProductMode.LIST);

  const goList = () => setMode(ProductMode.LIST);
  const goCreate = () => setMode(ProductMode.CREATE);
  const goUpdate = () => setMode(ProductMode.UPDATE);

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
      {mode === ProductMode.LIST && <ListProduct onUpdate={goUpdate} />}
      {mode === ProductMode.CREATE && <CreateProduct onSubmit={() => {}} />}
      {mode === ProductMode.UPDATE && <UpdateProduct />}
    </Stack>
  );
}

export default ProductScreen;