import * as Yup from 'yup';

export const localeSchema = Yup.object({
  language_id: Yup.string().required('Bắt buộc'),
  title: Yup.string().required('Không được để trống'),
  slug: Yup.string().required('Không được để trống'),
  content: Yup.string().required('Không được để trống'),
  meta_description: Yup.string().required('Bắt buộc'),
});

export const schema = Yup.object({
  thumbnail: Yup.mixed<File>()
    .required('Vui lòng chọn ảnh đại diện!')
    .test('fileType', 'File phải là ảnh', (f) => !f || (f && f.type.startsWith('image/'))),
  post_category_id: Yup.string().required('Danh mục là bắt buộc'),
  vi: localeSchema,
  en: localeSchema,
});