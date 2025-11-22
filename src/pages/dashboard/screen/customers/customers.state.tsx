import { useState } from "react";

export type Role = "Admin" | "Quản lý" | "Nhân viên" | "Khách hàng";
export type Status = "Hoạt động" | "Bị khóa";

export type User = {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  status: Status;
};

export type ModalMode = "view" | "edit" | "add" | null;

const initialUsers: User[] = [
  { id: "1", fullName: "Nguyễn Văn A", email: "a@example.com", role: "Admin", status: "Hoạt động" },
  { id: "2", fullName: "Trần Thị B", email: "b@example.com", role: "Nhân viên", status: "Bị khóa" },
];

export function useCustomersState() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selected, setSelected] = useState<User | null>(null);

  function openAdd() {
    setModalMode("add");
    setSelected(null);
  }
  function openView(user: User) {
    setSelected(user);
    setModalMode("view");
  }
  function openEdit(user: User) {
    setSelected(user);
    setModalMode("edit");
  }
  function closeModal() {
    setModalMode(null);
    setSelected(null);
  }

  function addUser(payload: Omit<User, "id">) {
    const newUser: User = { id: Date.now().toString(), ...payload };
    setUsers(prev => [newUser, ...prev]);
  }

  function updateUser(id: string, payload: Partial<User>) {
    setUsers(prev => prev.map(u => (u.id === id ? { ...u, ...payload } : u)));
  }

  function deleteUser(id: string) {
    setUsers(prev => prev.filter(u => u.id !== id));
  }

  return {
    users,
    modalMode,
    selected,
    openAdd,
    openView,
    openEdit,
    closeModal,
    addUser,
    updateUser,
    deleteUser,
  };
}