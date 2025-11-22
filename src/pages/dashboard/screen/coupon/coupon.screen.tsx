import { Button, Divider, Stack, Typography, useTheme } from "@mui/material";
import { StackRowAlignCenter } from "~/components/elements/styles/stack.style";
import { CouponMode } from "./coupon.enum";
import { useState } from "react";
import ListCoupon from "./coupon-list";
import CreateCoupon from "./coupon-create";
import { Coupon } from "~/apis/coupon/coupon.interface.api";

const CouponScreen: React.FC = () => {
  const { palette } = useTheme();
  const [mode, setMode] = useState<CouponMode>(CouponMode.LIST);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | undefined>(undefined);

  const goList = () => {
    setEditingCoupon(undefined);
    setMode(CouponMode.LIST);
  };
  
  const goCreate = () => {
    setEditingCoupon(undefined);
    setMode(CouponMode.CREATE);
  };
  



  return (
    <Stack spacing={2}>
      <StackRowAlignCenter sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h3">Quản lý mã giảm giá</Typography>
        {mode === CouponMode.LIST && (
          <Button onClick={goCreate}>
            <Typography variant="subtitle2">Thêm mã giảm giá mới</Typography>
          </Button>
        )}
        {(mode === CouponMode.CREATE || mode === CouponMode.UPDATE) && (
          <Button onClick={goList}>
            <Typography variant="subtitle2">Quay Lại</Typography>
          </Button>
        )}
      </StackRowAlignCenter>
      <Divider sx={{ color: palette.divider }} />
      
      {mode === CouponMode.LIST && <ListCoupon />}
      {mode === CouponMode.CREATE && <CreateCoupon onSubmit={() => goList()} />}
    </Stack>
  );
}

export default CouponScreen;