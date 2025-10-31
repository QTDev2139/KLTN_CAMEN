import * as Yup from 'yup';

export const schema = Yup.object().shape({
    name: Yup.string().required('Tên khách hàng là bắt buộc'),
    phone: Yup.string().required('Số điện thoại là bắt buộc'),
    email: Yup.string().required('Email là bắt buộc').email('Email không hợp lệ').nullable(),
    province: Yup.string().required('Tỉnh/Thành là bắt buộc'),
    district: Yup.string().required('Quận/Huyện là bắt buộc'),
    street: Yup.string().required('Số nhà, đường là bắt buộc'), 
})