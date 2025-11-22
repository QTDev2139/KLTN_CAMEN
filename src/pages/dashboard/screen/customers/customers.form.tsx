import React, { useEffect } from "react";
import { useFormik, getIn } from "formik";
import { schema } from "./customers.schema";
import { useSnackbar } from "~/hooks/use-snackbar/use-snackbar";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Box from "@mui/material/Box";
import type { ModalMode, Role, Status, User } from "./customers.state";

type Props = {
  open: boolean;
  mode: ModalMode;
  initial?: User | null;
  onClose: () => void;
  onSave: (payload: { fullName: string; email: string; password?: string; role: Role; status: Status }) => void;
};

const roles: Role[] = ["Admin", "Quản lý", "Nhân viên", "Khách hàng"];

export default function CustomersForm({ open, mode, initial, onClose, onSave }: Props) {
  const { snackbar } = useSnackbar();

  const formik = useFormik({
    initialValues: {
      fullName: initial?.fullName ?? "",
      email: initial?.email ?? "",
      password: "",
      confirm_password: "",
      role: (initial?.role ?? "Khách hàng") as Role,
      status: (initial?.status ?? "Hoạt động") as Status,
    },
    enableReinitialize: true,
    validationSchema: schema,
    validateOnBlur: true,
    onSubmit: async (values, helpers) => {
      try {
        // call parent save
        await onSave({
          fullName: values.fullName.trim(),
          email: values.email.trim(),
          password: values.password || undefined,
          role: values.role,
          status: values.status,
        });
      } catch (err: any) {
        // show snackbar on unexpected error
        snackbar("error", err?.message || "Có lỗi xảy ra");
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    formik.setFieldValue("password", "");
    formik.setFieldValue("confirm_password", "");
  }, [initial, mode, open]);

  const readOnly = mode === "view";
  const showError = (path: string) => {
    const touched = getIn(formik.touched, path);
    const error = getIn(formik.errors, path);
    return (touched || formik.submitCount > 0) && Boolean(error);
  };
  const helperText = (path: string) => (showError(path) ? (getIn(formik.errors, path) as string) : " ");

  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Chi tiết người dùng</DialogTitle>
      <form onSubmit={formik.handleSubmit} noValidate>
        <DialogContent dividers>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}>
            <TextField
              label="Họ tên người dùng"
              name="fullName"
              value={formik.values.fullName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={readOnly}
              fullWidth
              error={showError("fullName")}
              helperText={helperText("fullName")}
            />

            <TextField
              label="Email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={readOnly}
              fullWidth
              type="email"
              error={showError("email")}
              helperText={helperText("email")}
            />

            <Box sx={{ gridColumn: "1 / -1", display: "flex", gap: 2 }}>
              <TextField
                label="Password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={readOnly}
                type={showPassword ? "text" : "password"}
                placeholder={mode === "edit" ? "Để trống nếu không đổi" : ""}
                fullWidth
                error={showError("password")}
                helperText={helperText("password")}
                InputProps={{
                  endAdornment:
                    !readOnly && (
                      <IconButton size="small" onClick={() => setShowPassword(s => !s)}>
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    ),
                }}
              />
              <TextField
                label="Xác nhận Password"
                name="confirm_password"
                value={formik.values.confirm_password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={readOnly}
                type={showPassword ? "text" : "password"}
                fullWidth
                error={showError("confirm_password")}
                helperText={helperText("confirm_password")}
              />
            </Box>

            <FormControl fullWidth>
              <InputLabel id="role-label">Vai trò</InputLabel>
              <Select
                labelId="role-label"
                name="role"
                value={formik.values.role}
                label="Vai trò"
                onChange={formik.handleChange}
                disabled={readOnly}
                error={showError("role")}
              >
                {roles.map(r => (
                  <MenuItem key={r} value={r}>
                    {r}
                  </MenuItem>
                ))}
              </Select>
              {showError("role") && <Box sx={{ color: "error.main", mt: 0.5, fontSize: 12 }}>{helperText("role")}</Box>}
            </FormControl>

            <Box>
              <Box sx={{ mb: 1 }}>Trạng thái</Box>
              <RadioGroup
                row
                name="status"
                value={formik.values.status}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <FormControlLabel value="Hoạt động" control={<Radio />} label="Hoạt động" disabled={readOnly} />
                <FormControlLabel value="Bị khóa" control={<Radio />} label="Bị khóa" disabled={readOnly} />
              </RadioGroup>
              {showError("status") && <Box sx={{ color: "error.main", mt: 0.5, fontSize: 12 }}>{helperText("status")}</Box>}
            </Box>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Đóng</Button>
          {mode !== "view" && (
            <Button variant="contained" type="submit" disabled={formik.isSubmitting}>
              Lưu
            </Button>
          )}
        </DialogActions>
      </form>
    </Dialog>
  );
}