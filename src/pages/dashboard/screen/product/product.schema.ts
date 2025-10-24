import * as Yup from 'yup';

const translateSchema = Yup.array().of(
  Yup.object({
    language_id: Yup.string().required('Bắt buộc'),
    name: Yup.string().required('Bắt buộc'),
    slug: Yup.string().required('Bắt buộc'),
    description: Yup.string().required('Bắt buộc'), // thay đổi thành chi tiết sản phẩm or bỏ
    nutrition_info: Yup.string().required('Bắt buộc'),
    usage_instruction: Yup.string().required('Bắt buộc'),
    reason_to_choose: Yup.string().notRequired(),
  })
);

const imageSchema = Yup.array().of(
  Yup.object({ 
    image_url: Yup.mixed<File>()
      .required('Vui lòng chọn ảnh thumbnail!')
      .test('fileType', 'File phải là ảnh', (f) => !f || (f && f.type.startsWith('image/'))),
  })
);

export const schema = Yup.object({
  price: Yup.number().required('Bắt buộc'),
  compare_at_price: Yup.number().required('Bắt buộc'),
  stock_quantity: Yup.number().required('Bắt buộc'),
  origin: Yup.string().required('Bắt buộc'),
  quantity_per_pack: Yup.number().required('Bắt buộc'),
  shipping_from: Yup.string().required('Bắt buộc'),
  product_translations: translateSchema,
  product_images: imageSchema,
});
