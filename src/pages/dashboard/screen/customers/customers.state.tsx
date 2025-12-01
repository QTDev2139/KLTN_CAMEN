import { TagType } from "~/components/elements/tag/tag.element";

export const StatusRole: Record<string, TagType> = {
    admin: 'success',
    root: 'success',
    manager: 'info',
    staff: 'warning',
    marketing: 'error',
    storekeeper: 'secondary',
}

export const NameStatusRole: Record<string, string> = {
    admin: 'Admin',
    root: 'ban lãnh đạo',
    manager: 'quản lý',
    staff: 'staff',
    marketing: 'marketing',
    storekeeper: 'nhân viên kho',
}

export const ConvertRole: Record<string, number> = {
    admin: 1,
    root: 2,
    manager: 3,
    staff: 5,
    marketing: 6,
    storekeeper: 7,
}