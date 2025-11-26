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
    .required('Vui lòng chọn dịch vụ'),

});
