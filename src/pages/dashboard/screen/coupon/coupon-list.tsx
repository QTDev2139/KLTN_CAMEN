import { DeleteOutline, ModeEditOutlineOutlined } from '@mui/icons-material';
import { IconButton, TableCell, TableRow, Tooltip, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { couponApi } from '~/apis';
import { Coupon } from '~/apis/coupon/coupon.interface.api';
import { formatDate } from '~/common/until/date-format.until';
import { FormatPrice } from '~/components/elements/format-price/format-price.element';
import { StackRowJustCenter } from '~/components/elements/styles/stack.style';
import TableElement from '~/components/elements/table-element/table-element';
import { ModalConfirm } from '~/components/modal/modal-confirm/modal-confirm';
import { useSnackbar } from '~/hooks/use-snackbar/use-snackbar';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import CouponViewModal from './coupon-view';
import { TagElement, TagType } from '~/components/elements/tag/tag.element';

type ListCouponProps = {
  onEdit: (coupon: Coupon) => void;
};

const getStateTagType = (state: string): TagType => {
  const stateMap: Record<string, TagType> = {
    pending: 'warning',      // Chờ duyệt - màu vàng
    approved: 'success',     // Đã duyệt - màu xanh lá
    rejected: 'error',       // Từ chối - màu đỏ
    expired: 'secondary',    // Hết hạn - màu xám
    disabled: 'secondary',   // Vô hiệu hóa - xám
  };
  return stateMap[state] || 'info';
};

const getStateLabel = (state: string): string => {
  const labelMap: Record<string, string> = {
    pending: 'Chờ duyệt',
    approved: 'Đã duyệt',
    rejected: 'Từ chối',
    expired: 'Hết hạn',
    disabled: 'Vô hiệu hóa',
  };
  return labelMap[state] || state;
};

const ListCoupon: React.FC<ListCouponProps> = ({ onEdit }) => {
  const [listCoupon, setListCoupon] = useState<Coupon[]>([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const { snackbar } = useSnackbar();
  const [openView, setOpenView] = useState(false);
  const [viewCoupon, setViewCoupon] = useState<Coupon | null>(null);
  const [loadingView, setLoadingView] = useState(false);

  const handleOpenConfirm = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setOpenConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedCoupon) return;
    setLoadingDelete(true);
    try {
      await couponApi.deleteCoupon(selectedCoupon.id);
      setListCoupon((prev) => prev.filter((p) => p.id !== selectedCoupon.id));
    } catch (error) {
      console.error(error);
      snackbar('error', 'Xóa sản phẩm thất bại');
    } finally {
      setLoadingDelete(false);
      setOpenConfirm(false);
    }
  };

  const handleEditClick = async (id: number) => {
    try {
      const detail = await couponApi.getCouponById(id);
      onEdit(detail);
    } catch (e) {
      console.error(e);
      snackbar('error', 'Không tải được thông tin mã giảm giá');
    }
  };
  const handleViewClick = async (id: number) => {
    setLoadingView(true);
    try {
      const detail = await couponApi.getCouponById(id);
      setViewCoupon(detail);
      setOpenView(true);
    } catch (e) {
      console.error(e);
      snackbar('error', 'Không tải được chi tiết mã giảm giá');
    } finally {
      setLoadingView(false);
    }
  };

  useEffect(() => {
    const fetchListCoupon = async () => {
      const result = await couponApi.getCoupons();
      setListCoupon(result);
    };
    fetchListCoupon();
  }, []);

  const columns = [
    { id: 'code', label: 'Mã giảm' },
    { id: 'discount_value', label: 'Giá trị giảm' },
    { id: 'min_order_amount', label: 'Đơn hàng tối thiểu' },
    { id: 'usage_limit', label: 'Giới hạn sử dụng' },
    { id: 'used_count', label: 'Đã sử dụng' },
    { id: 'start_date', label: 'Ngày bắt đầu' },
    { id: 'end_date', label: 'Ngày kết thúc' },
    { id: 'state', label: 'Trạng thái' },
    { id: 'is_active', label: 'Trạng thái hoạt động' },
    { id: 'action', label: 'Action' },
  ];

  return (
    <React.Fragment>
      <TableElement
        columns={columns}
        rows={listCoupon}
        renderRow={(coupon, index) => (
          <TableRow hover key={index} sx={{ position: 'sticky' }}>
            <TableCell>
              <Typography>{coupon.code}</Typography>
            </TableCell>
            <TableCell sx={{ textAlign: 'right' }}>
              <Typography sx={{ width: '110px' }}>
                {coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : FormatPrice(coupon.discount_value)}
              </Typography>
            </TableCell>
            <TableCell sx={{ textAlign: 'right' }}>
              <Typography sx={{ width: '165px' }}>{FormatPrice(coupon.min_order_amount)}</Typography>
            </TableCell>
            <TableCell sx={{ textAlign: 'center' }}>
              <Typography sx={{ width: '165px' }}>{coupon.usage_limit}</Typography>
            </TableCell>
            <TableCell sx={{ textAlign: 'center' }}>
              <Typography sx={{ width: '105px' }}>{coupon.used_count}</Typography>
            </TableCell>
            <TableCell>
              <Typography sx={{ width: '125px' }}>{formatDate(coupon.start_date)}</Typography>
            </TableCell>
            <TableCell>
              <Typography sx={{ width: '125px' }}>{formatDate(coupon.end_date)}</Typography>
            </TableCell>
            <TableCell>
              <TagElement 
                type={getStateTagType(coupon.state)} 
                content={getStateLabel(coupon.state)} 
                width={100}
              />
            </TableCell>
            <TableCell sx={{ textAlign: 'center' }}>
              <TagElement 
                type={coupon.is_active ? 'success' : 'error'} 
                content={coupon.is_active ? 'Hoạt động' : 'Không hoạt động'} 
                width={200}
              />
            </TableCell>
            <TableCell sx={{ position: 'sticky', right: 0, backgroundColor: 'background.default' }}>
              <StackRowJustCenter sx={{ width: '100%', cursor: 'pointer' }}>
                <Tooltip title="Xem">
                  <IconButton onClick={() => handleViewClick(coupon.id)}>
                    <VisibilityOutlinedIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Sửa">
                  <IconButton onClick={() => handleEditClick(coupon.id)}>
                    <ModeEditOutlineOutlined />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Xóa">
                  <IconButton onClick={() => handleOpenConfirm(coupon)}>
                    <DeleteOutline />
                  </IconButton>
                </Tooltip>
              </StackRowJustCenter>
            </TableCell>
          </TableRow>
        )}
      />
      <ModalConfirm
        open={openConfirm}
        title="Xóa mã giảm giá"
        message={`Bạn có chắc muốn xóa mã "${selectedCoupon?.code}" không?`}
        onClose={() => setOpenConfirm(false)}
        onConfirm={handleConfirmDelete}
        loading={loadingDelete}
      />
      <CouponViewModal
        open={openView}
        onClose={() => {
          setOpenView(false);
          setViewCoupon(null);
        }}
        coupon={viewCoupon}
      />
    </React.Fragment>
  );
};
export default ListCoupon;
