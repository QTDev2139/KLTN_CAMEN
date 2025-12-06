import { DeleteOutline, ModeEditOutlineOutlined } from '@mui/icons-material';
import { IconButton, TableCell, TableRow, Tooltip, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { couponApi, userApi } from '~/apis';
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
import CouponUpdateModal from './coupon-update';
import { getValidityStatus, StateLabel, StateTagType } from './coupon.state';

// thêm hàm tính Hiệu lực

const ListCoupon: React.FC = () => {
  const [listCoupon, setListCoupon] = useState<Coupon[]>([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const { snackbar } = useSnackbar();
  const [openView, setOpenView] = useState(false);
  const [viewCoupon, setViewCoupon] = useState<Coupon | null>(null);
  const [loadingView, setLoadingView] = useState(false);

  const [openUpdate, setOpenUpdate] = useState(false);
  const [updateCoupon, setUpdateCoupon] = useState<Coupon | null>(null);

  const [role, setRole] = useState('');
  useEffect(() => {
    const fetchProfile = async () => {
      const profile = await userApi.getProfile();
      setRole(profile.role.name);
    };
    fetchProfile();
  }, []);
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
      snackbar('success', 'Xóa mã giảm giá thành công');
    } catch (error) {
      console.error(error);
      snackbar('error', 'Xóa sản phẩm thất bại');
    } finally {
      setLoadingDelete(false);
      setOpenConfirm(false);
    }
  };

  // open edit/update modal (fetch detail then open update)
  const handleEditClick = async (id: number) => {
    setLoadingView(true);
    try {
      const detail = await couponApi.getCouponById(id);
      setUpdateCoupon(detail);
      setOpenUpdate(true);
    } catch (e) {
      console.error(e);
      snackbar('error', 'Không tải được chi tiết mã giảm giá');
    } finally {
      setLoadingView(false);
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
    { id: 'code', label: 'Mã giảm', width: 80 },
    { id: 'discount_value', label: 'Giá trị giảm', width: 120 },
    { id: 'min_order_amount', label: 'Đơn hàng tối thiểu', width: 180 },
    { id: 'usage_limit', label: 'Giới hạn sử dụng', width: 180 },
    { id: 'used_count', label: 'Đã sử dụng', width: 120 },
    { id: 'start_date', label: 'Ngày bắt đầu', width: 140 },
    { id: 'end_date', label: 'Ngày kết thúc', width: 140 },
    { id: 'state', label: 'Trạng thái duyệt', width: 142 },
    { id: 'validity', label: 'Hiệu lực', width: 100 },
    { id: 'is_active', label: 'Trạng thái hoạt động', width: 182 },
    { id: 'action', label: 'Action', width: 200 },
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
              <Typography>
                {coupon.discount_type === 'percentage'
                  ? `${Number(coupon.discount_value)}% - ${FormatPrice(coupon.max_discount_amount)}`
                  : FormatPrice(coupon.discount_value)}
              </Typography>
            </TableCell>
            <TableCell sx={{ textAlign: 'right' }}>
              <Typography>{FormatPrice(coupon.min_order_amount)}</Typography>
            </TableCell>
            <TableCell sx={{ textAlign: 'center' }}>
              <Typography>{coupon.usage_limit}</Typography>
            </TableCell>
            <TableCell sx={{ textAlign: 'center' }}>
              <Typography>{coupon.used_count}</Typography>
            </TableCell>
            <TableCell>
              <Typography>{formatDate(coupon.start_date)}</Typography>
            </TableCell>
            <TableCell>
              <Typography>{formatDate(coupon.end_date)}</Typography>
            </TableCell>
            <TableCell>
              <TagElement type={StateTagType[coupon.state]} content={StateLabel[coupon.state]} />
            </TableCell>

            <TableCell>
              {(() => {
                const validity = getValidityStatus(coupon);
                return validity.label ? (
                  <TagElement type={validity.type || 'info'} content={validity.label} />
                ) : (
                  <Typography sx={{ textAlign: 'center' }}>-</Typography>
                );
              })()}
            </TableCell>
            <TableCell sx={{ textAlign: 'center' }}>
              <TagElement
                type={coupon.is_active ? 'success' : 'error'}
                content={coupon.is_active ? 'Hoạt động' : 'Không hoạt động'}
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
                  <IconButton
                    onClick={() => handleEditClick(coupon.id)}
                    disabled={
                      (role !== 'root' && coupon.state === 'rejected') || (role === 'root' && coupon.state !== 'pending') || (role !== 'root' && coupon.state === 'pending')
                    }
                  >
                    {/* Thay root bằng giám đốc  */}
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
      <CouponUpdateModal
        open={openUpdate}
        onClose={() => {
          setOpenUpdate(false);
          setUpdateCoupon(null);
        }}
        coupon={updateCoupon}
        onSubmitted={async () => {
          const data = await couponApi.getCoupons();
          setListCoupon(data);
        }}
        role={role}
      />
    </React.Fragment>
  );
};
export default ListCoupon;
