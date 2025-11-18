import * as Yup from 'yup';

export const orderSchema = Yup.object({
  customerName: Yup.string().required('Vui lòng nhập tên khách hàng'),
  phone: Yup.string()
    .required('Vui lòng nhập số điện thoại')
    .matches(/^[0-9]{10}$/, 'Số điện thoại phải có 10 chữ số'),
  email: Yup.string().email('Email không hợp lệ').nullable(),
  gender: Yup.string().oneOf(['Nam', 'Nữ'], 'Vui lòng chọn giới tính'),
  province: Yup.object().nullable().required('Vui lòng chọn tỉnh/thành phố'),
  ward: Yup.object().nullable().required('Vui lòng chọn phường/xã'),
  street: Yup.string().required('Vui lòng nhập số nhà, đường'),
  note: Yup.string().nullable(),
  paymentMethod: Yup.string().oneOf(['cod', 'vnpay', 'momo'], 'Vui lòng chọn phương thức thanh toán'),
});