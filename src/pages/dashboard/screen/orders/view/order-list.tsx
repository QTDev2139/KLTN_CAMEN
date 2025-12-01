import { DeleteOutline, ModeEditOutlineOutlined } from '@mui/icons-material';
import { IconButton, TableCell, TableRow, Tooltip, Typography, Box, useTheme } from '@mui/material';
import React, { useEffect, useState, useMemo } from 'react';
import { getOrderDetail, getOrders } from '~/apis/order/order.api';
import { OrderDetail } from '~/apis/order/order.interface.api';
import { formatDate } from '~/common/until/date-format.until';
import { FormatPrice } from '~/components/elements/format-price/format-price.element';
import { StackRowAlignCenter, StackRowJustCenter } from '~/components/elements/styles/stack.style';
import { TagElement } from '~/components/elements/tag/tag.element';
import TableElement from '~/components/elements/table-element/table-element';
import { ModalConfirm } from '~/components/modal/modal-confirm/modal-confirm';
import { useSnackbar } from '~/hooks/use-snackbar/use-snackbar';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import OrderViewModal from './order-view';
import { PaymentMethodLabel, PaymentStatusLabel, PaymentStatusTagType, ORDER_FILTERS, statusColorMap, statusLabelMap } from '../order.state';



const ListOrder: React.FC = () => {
  const [listOrder, setListOrder] = useState<OrderDetail[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const { snackbar } = useSnackbar();
  const [openView, setOpenView] = useState(false);
  const [viewOrder, setViewOrder] = useState<OrderDetail | null>(null);
  const [editable, setEditable] = useState<boolean>(false);

  const filteredOrders = useMemo(
    () => (activeFilter === 'all' ? listOrder : listOrder.filter(o => o.status === activeFilter)),
    [listOrder, activeFilter]
  );

  const handleFilterChange = (filterValue: string) => {
    setActiveFilter(filterValue);
  };

  const handleOpenConfirm = (order: OrderDetail) => {
    setSelectedOrder(order);
    setOpenConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedOrder) return;
    setLoadingDelete(true);
    try {
      // TODO: Implement delete order API
      // await deleteOrder(selectedOrder.id);
      setListOrder((prev) => prev.filter((o) => o.id !== selectedOrder.id));
      snackbar('success', 'Xóa đơn hàng thành công');
    } catch (error) {
      console.error(error);
      snackbar('error', 'Xóa đơn hàng thất bại');
    } finally {
      setLoadingDelete(false);
      setOpenConfirm(false);
      setSelectedOrder(null);
    }
  };

  const handleEditClick = async (id: number) => {
    try {
      const detail = await getOrderDetail(id);
      const orderData = Array.isArray(detail) ? detail[0] : detail;
      setViewOrder(orderData);
      setEditable(true);
      setOpenView(true);
    } catch (e) {
      console.error(e);
      snackbar('error', 'Không tải được thông tin đơn hàng');
    }
  };

  const handleViewClick = async (id: number) => {
    try {
      const detail = await getOrderDetail(id);
      setViewOrder(Array.isArray(detail) ? detail[0] : detail);
      setEditable(false);
      setOpenView(true);
    } catch (e) {
      console.error(e);
      snackbar('error', 'Không tải được chi tiết đơn hàng');
    }
  };

  // Thêm function để refresh danh sách
  const fetchListOrder = async () => {
    try {
      const result = await getOrders();
      setListOrder(result || []);
    } catch (error) {
      console.error(error);
      snackbar('error', 'Không tải được danh sách đơn hàng');
    }
  };

  useEffect(() => {
    fetchListOrder();
  }, []);

  const columns = [
    { id: 'code', label: 'Mã đơn hàng' },
    { id: 'grand_total', label: 'Tổng tiền' },
    { id: 'payment_method', label: 'Phương thức TT' },
    { id: 'payment_status', label: 'Trạng thái TT' },
    { id: 'status', label: 'Trạng thái đơn' },
    { id: 'created_at', label: 'Ngày tạo' },
    { id: 'action', label: 'Thao tác' },
  ];

  return (
    <React.Fragment>
      <StackRowAlignCenter
        columnGap={2}
        sx={{
          mb: 2,
          flexWrap: 'wrap',
          position: 'relative',
          userSelect: 'none',
        }}
      >
        {ORDER_FILTERS.map(filter => {
          const active = activeFilter === filter.value;
          return (
            <Box
              key={filter.value}
              component="div"
              onClick={() => handleFilterChange(filter.value)}
              sx={{
                px: 2,
                py: 0.75,
                cursor: 'pointer',
                borderBottom: '2px solid transparent',
                color: active ? 'primary.main' : 'text.primary',
                transition: 'color .25s ease',
                position: 'relative',
                '&:hover': {
                  color: 'primary.main',
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  bottom: 0,
                  height: 2,
                  width: '100%',
                  backgroundColor: active ? 'primary.main' : 'transparent',
                  transition: 'background-color .25s ease',
                },
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600, 
                  lineHeight: 1.4,
                  minWidth: 90, 
                  textAlign: 'center',
                  letterSpacing: 0.15,
                }}
              >
                {filter.label}
              </Typography>
            </Box>
          );
        })}
      </StackRowAlignCenter>

      <Box
        sx={{
          scrollbarGutter: 'stable',
          '&:has(table)': { overflowY: 'auto' },
        }}
      >
        <TableElement
          columns={columns}
          rows={filteredOrders}
          renderRow={(order, index) => (
            <TableRow hover key={order.id ?? index}>
              <TableCell>
                <Typography fontWeight={600}>{order.code}</Typography>
              </TableCell>
              <TableCell sx={{ textAlign: 'right' }}>
                <Typography width={100} fontWeight={600}>{FormatPrice(order.grand_total)}</Typography>
              </TableCell>
              <TableCell sx={{ textAlign: 'center' }}>
                <Typography width={165}>{PaymentMethodLabel[order.payment_method]}</Typography>
              </TableCell>
              <TableCell sx={{ textAlign: 'center' }}>
                <TagElement
                  type={PaymentStatusTagType[order.payment_status]}
                  content={PaymentStatusLabel[order.payment_status]}
                  width={130}
                />
              </TableCell>
              <TableCell sx={{ textAlign: 'center' }}>
                <TagElement
                  type={statusColorMap[order.status]}
                  content={statusLabelMap[order.status]}
                  width={130}
                />
              </TableCell>
              <TableCell>
                <Typography width={95}>{formatDate(order.created_at)}</Typography>
              </TableCell>
              <TableCell sx={{ position: 'sticky', right: 0, backgroundColor: 'background.default' }}>
                <StackRowJustCenter sx={{ width: '100%', cursor: 'pointer' }}>
                  <Tooltip title="Xem">
                    <IconButton onClick={() => handleViewClick(order.id)}>
                      <VisibilityOutlinedIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Sửa">
                    <IconButton onClick={() => handleEditClick(order.id)} disabled={order.status === 'completed' || order.status === 'cancelled'}>
                      <ModeEditOutlineOutlined />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Xóa">
                    <IconButton onClick={() => handleOpenConfirm(order)}>
                      <DeleteOutline />
                    </IconButton>
                  </Tooltip>
                </StackRowJustCenter>
              </TableCell>
            </TableRow>
          )}
        />
      </Box>
      <ModalConfirm
        open={openConfirm}
        title="Xóa đơn hàng"
        message={`Bạn có chắc muốn xóa đơn hàng "${selectedOrder?.code}" không?`}
        onClose={() => {
          setOpenConfirm(false);
          setSelectedOrder(null);
        }}
        onConfirm={handleConfirmDelete}
        loading={loadingDelete}
      />
      <OrderViewModal
        open={openView}
        onClose={() => {
          setOpenView(false);
          setViewOrder(null);
        }}
        order={viewOrder}
        editable={editable}
        onUpdateSuccess={fetchListOrder}
      />
    </React.Fragment>
  );
};

export default ListOrder;
