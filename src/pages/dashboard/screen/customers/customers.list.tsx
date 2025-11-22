import React from "react";
import { User } from "./customers.state";
import TableElement from "~/components/elements/table-element/table-element";
import { StackRowJustCenter } from "~/components/elements/styles/stack.style";
import { TagElement } from "~/components/elements/tag/tag.element";
import { TableRow, TableCell, IconButton, Tooltip, Typography } from "@mui/material";
import VisibilityOutlined from "@mui/icons-material/VisibilityOutlined";
import { ModeEditOutlineOutlined, DeleteOutline } from "@mui/icons-material";

type Props = {
  users: User[];
  onView: (u: User) => void;
  onEdit: (u: User) => void;
  onDelete: (u: User) => void;
};

export default function CustomersList({ users, onView, onEdit, onDelete }: Props) {
  const columns = [
    { id: "fullName", label: "Họ tên người dùng", width: 240 },
    { id: "email", label: "Email", width: 260 },
    { id: "role", label: "Vai trò", width: 120 },
    { id: "status", label: "Trạng thái", width: 120 },
    { id: "action", label: "Action", width: 160 },
  ];

  return (
    <TableElement
      columns={columns}
      rows={users}
      renderRow={(user, index) => (
        <TableRow hover key={user.id}>
          <TableCell>
            <Typography>{user.fullName}</Typography>
          </TableCell>

          <TableCell>
            <Typography>{user.email}</Typography>
          </TableCell>

          <TableCell>
            <Typography>{user.role}</Typography>
          </TableCell>

          <TableCell>
            <TagElement type={user.status === "Hoạt động" ? "success" : "error"} content={user.status} />
          </TableCell>

          <TableCell sx={{ position: "sticky", right: 0, backgroundColor: "background.default" }}>
            <StackRowJustCenter sx={{ width: "100%", cursor: "pointer" }}>
              <Tooltip title="Xem">
                <IconButton size="small" onClick={() => onView(user)}>
                  <VisibilityOutlined fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Sửa">
                <IconButton size="small" onClick={() => onEdit(user)}>
                  <ModeEditOutlineOutlined fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Xóa">
                <IconButton size="small" onClick={() => onDelete(user)}>
                  <DeleteOutline fontSize="small" />
                </IconButton>
              </Tooltip>
            </StackRowJustCenter>
          </TableCell>
        </TableRow>
      )}
    />
  );
}