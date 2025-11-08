import { Button, Divider, Stack, Typography, useTheme } from "@mui/material";
import { StackRowAlignCenter } from "~/components/elements/styles/stack.style";
import { OrderMode } from "./order.enum";
import { useState } from "react";
import ListOrder from "./view/order-list";
import CreateOrder from "./view/order-create";
import { Order } from "~/apis/order/order.interface.api";

const OrderScreen: React.FC = () => {
  const { palette } = useTheme();
  const [mode, setMode] = useState<OrderMode>(OrderMode.LIST);
  const [editingOrder, setEditingOrder] = useState<Order | undefined>(undefined);

  const goList = () => {
    setEditingOrder(undefined);
    setMode(OrderMode.LIST);
  };
  
  const goCreate = () => {
    setEditingOrder(undefined);
    setMode(OrderMode.CREATE);
  };
  
  const goUpdate = (Order: Order) => {
    setEditingOrder(Order);
    setMode(OrderMode.UPDATE);
  };


  return (
    <Stack spacing={2}>
      <StackRowAlignCenter sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h3">Quản lý đơn hàng</Typography>
        {mode === OrderMode.LIST && (
          <Button onClick={goCreate}>
            <Typography variant="subtitle2">Thêm đơn hàng mới</Typography>
          </Button>
        )}
        {(mode === OrderMode.CREATE || mode === OrderMode.UPDATE) && (
          <Button onClick={goList}>
            <Typography variant="subtitle2">Quay Lại</Typography>
          </Button>
        )}
      </StackRowAlignCenter>
      <Divider sx={{ color: palette.divider }} />
      
      {mode === OrderMode.LIST && <ListOrder />}
      {mode === OrderMode.CREATE && <CreateOrder />}
      {/* {mode === OrderMode.UPDATE && <CreateOrder initial={editingOrder} />} */}
    </Stack>
  );
}

export default OrderScreen;