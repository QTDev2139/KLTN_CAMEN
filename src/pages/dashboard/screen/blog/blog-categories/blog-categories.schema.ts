import * as yup from "yup";

export const translationSchema = yup.object().shape({
  name: yup.string().required("Tên là bắt buộc").max(255),
  slug: yup.string().required("Slug là bắt buộc").max(255),
  language_id: yup.mixed().required("Ngôn ngữ là bắt buộc"),
});

export const schema = yup.object().shape({
  post_category_translations: yup
    .array()
    .of(translationSchema)
    .required("Cần 2 bản dịch: Tiếng Việt và English")
    .length(2, "Cần đúng 2 bản dịch (Tiếng Việt và English)")
    .test(
      "langs-present",
      "Cần cả Tiếng Việt (language_id=1) và English (language_id=2)",
      (arr) => {
        if (!Array.isArray(arr)) return false;
        const ids = arr.map((a: any) => String(a.language_id));
        return ids.includes("1") && ids.includes("2");
      }
    )
    .test(
      "unique-langs",
      "Mỗi ngôn ngữ chỉ xuất hiện một lần",
      (arr) => {
        if (!Array.isArray(arr)) return false;
        const ids = arr.map((a: any) => String(a.language_id));
        return new Set(ids).size === ids.length;
      }
    ),
});