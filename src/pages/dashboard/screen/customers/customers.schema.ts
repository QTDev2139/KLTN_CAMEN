import * as yup from "yup";

const ROLES = ["Admin", "Quản lý", "Nhân viên", "Khách hàng"] as const;
const STATUSES = ["Hoạt động", "Bị khóa"] as const;

export const schema = yup.object().shape({
  fullName: yup.string().required("Họ tên là bắt buộc").min(2, "Họ tên quá ngắn"),
  email: yup.string().required("Email là bắt buộc").email("Email không hợp lệ"),
  // password bắt buộc khi tạo mới (context.mode === 'add'), khi edit thì không bắt buộc nhưng nếu nhập phải >=6
  password: yup
    .string()
    .when("$mode", (mode: any, schemaField: yup.StringSchema) =>
      mode === "add"
        ? schemaField.required("Password là bắt buộc").min(6, "Mật khẩu tối thiểu 6 ký tự")
        : schemaField.notRequired().min(6, "Mật khẩu tối thiểu 6 ký tự")
    ),
  confirm_password: yup
    .string()
    .when("$mode", (mode: any, schemaField: yup.StringSchema) =>
      mode === "add"
        ? schemaField.required("Xác nhận mật khẩu là bắt buộc").oneOf([yup.ref("password")], "Password và Xác nhận Password không khớp")
        : schemaField.notRequired().oneOf([yup.ref("password"), ""], "Password và Xác nhận Password không khớp")
    ),
  role: yup.string().required("Vai trò là bắt buộc").oneOf(ROLES as unknown as string[], "Vai trò không hợp lệ"),
  status: yup.string().required("Trạng thái là bắt buộc").oneOf(STATUSES as unknown as string[], "Trạng thái không hợp lệ"),
});