import * as Yup from 'yup';

export const ContactSchema = Yup.object({
  name: Yup.string()
    .required('Vui lòng nhập tên'),
  email: Yup.string()
    .email('Email không hợp lệ')
    .required('Vui lòng nhập email'),
  phone: Yup.string()
    .matches(/^[0-9]{9,11}$/, 'Số điện thoại không hợp lệ') 
    .required('Vui lòng nhập số điện thoại'),
  title: Yup.string()
    .max(100, 'Tiêu đề quá dài')
    .required('Vui lòng nhập tiêu đề'),
  content: Yup.string()
    .max(1000, 'Nội dung quá dài')
    .required('Vui lòng nhập nội dung'),
  gender: Yup.string()
    .required('Vui lòng chọn vai trò'),

});
