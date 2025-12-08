import { Button, Divider, Stack, Typography, useTheme, TextField, Select, MenuItem } from "@mui/material";
import { StackRowAlignCenter } from "~/components/elements/styles/stack.style";
import { OrderMode } from "./order.enum";
import { useState } from "react";
import ListOrder from "./view/order-list";
import CreateOrder from "./view/order-create";
import SearchIcon from '@mui/icons-material/Search';

const OrderScreen: React.FC = () => {
  const { palette } = useTheme();
  const [mode, setMode] = useState<OrderMode>(OrderMode.LIST);


  return (
    <Stack spacing={2}>
      <StackRowAlignCenter sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h3">Quản lý đơn hàng</Typography>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <TextField
            placeholder="Mã đơn hàng..."
            size="small"
            variant="outlined"
            sx={{ width: 200 }}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
            }}
          />
          <Select
            size="small"
            displayEmpty
            sx={{ width: 180 }}
            defaultValue=""
          >
            <MenuItem value="">Loại thanh toán</MenuItem>
            <MenuItem value="cash">Tiền mặt</MenuItem>
            <MenuItem value="e_wallet">Chuyển khoản</MenuItem>
          </Select>
          <TextField
            type="date"
            size="small"
            variant="outlined"
            label="Từ ngày"
            InputLabelProps={{ shrink: true }}
            sx={{ width: 150 }}
          />
          <TextField
            type="date"
            size="small"
            variant="outlined"
            label="Đến ngày"
            InputLabelProps={{ shrink: true }}
            sx={{ width: 150 }}
          />
          <Button variant="contained" size="small">
            Lọc
          </Button>
        </Stack>
      </StackRowAlignCenter>
      <Divider sx={{ color: palette.divider }} />
      
      {mode === OrderMode.LIST && <ListOrder />}
      {mode === OrderMode.CREATE && <CreateOrder />}
      {/* {mode === OrderMode.UPDATE && <CreateOrder initial={editingOrder} />} */}
    </Stack>
  );
}

export default OrderScreen;