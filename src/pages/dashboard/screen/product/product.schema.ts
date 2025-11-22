import * as Yup from 'yup';

export const schema = Yup.object().shape({
  price: Yup.number().required('Giá bán là bắt buộc').min(0, 'Giá phải lớn hơn 0'),
  compare_at_price: Yup.number().nullable().min(0, 'Giá phải lớn hơn 0'),
  stock_quantity: Yup.number().required('Tồn kho là bắt buộc').min(0, 'Tồn kho phải lớn hơn 0'),
  origin: Yup.string().required('Xuất xứ là bắt buộc'),
  quantity_per_pack: Yup.number().required('Số lượng/combo là bắt buộc').min(1, 'Số lượng phải lớn hơn 0'),
  shipping_from: Yup.string().required('Nơi giao hàng là bắt buộc'),
  category_id: Yup.number().required('Danh mục là bắt buộc'),
  type: Yup.string().required('Loại sản phẩm là bắt buộc'),
  product_translations: Yup.array().of(
    Yup.object().shape({
      language_id: Yup.number().required(),
      name: Yup.string().required('Tên sản phẩm là bắt buộc'),
      slug: Yup.string().required('Slug là bắt buộc'),
      description: Yup.string().required('Mô tả là bắt buộc'),
      ingredient: Yup.string().nullable().default(''),
      nutrition_info: Yup.string().required('Thông tin dinh dưỡng là bắt buộc'),
      usage_instruction: Yup.string().required('Hướng dẫn sử dụng là bắt buộc'),
      reason_to_choose: Yup.string().nullable().default(''),
    })
  ),
});
