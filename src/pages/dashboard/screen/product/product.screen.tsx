import { Button, Divider, Stack, Typography, useTheme, TextField, MenuItem } from "@mui/material";
import { StackRowAlignCenter } from "~/components/elements/styles/stack.style";
import { ProductMode } from "./product.enum";
import { useState } from "react";
import ListProduct from "./product-list";
import CreateProduct from "./product-create";
import { ProductDetail } from "~/apis/product/product.interface.api";
import SearchIcon from '@mui/icons-material/Search';

const ProductScreen: React.FC = () => {
  const { palette } = useTheme();
  const [mode, setMode] = useState<ProductMode>(ProductMode.LIST);
  const [editingProduct, setEditingProduct] = useState<ProductDetail | undefined>(undefined);
  const [filterType, setFilterType] = useState<'domestic' | 'export'>('domestic');
  const [searchName, setSearchName] = useState<string>('');

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

  return (
    <Stack spacing={2}>
      <StackRowAlignCenter sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h3">Quản lý sản phẩm</Typography>
        {mode === ProductMode.LIST ? (
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              placeholder="Tìm kiếm theo tên sản phẩm..."
              size="small"
              variant="outlined"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              sx={{ minWidth: 280 }}
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
            <Button onClick={goCreate} variant="outlined">
              <Typography variant="subtitle2">Thêm sản phẩm mới</Typography>
            </Button>
          </Stack>
        ) : (
          <Button onClick={goList} variant="outlined">
            <Typography variant="subtitle2">Quay Lại</Typography>
          </Button>
        )}
      </StackRowAlignCenter>
      <Divider sx={{ color: palette.divider }} />
      
      {mode === ProductMode.LIST && <ListProduct onEdit={goUpdate} filterType={filterType} searchName={searchName} />}
      {mode === ProductMode.CREATE && <CreateProduct onSuccess={goList} />}
      {mode === ProductMode.UPDATE && <CreateProduct initial={editingProduct} onSuccess={goList} />}
    </Stack>
  );
}

export default ProductScreen;