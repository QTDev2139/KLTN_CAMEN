import { TagType } from "~/components/elements/tag/tag.element";

export const StatusRole: Record<string, TagType> = {
    admin: 'success',
    root: 'success',
    manager: 'info',
    staff: 'warning',
    marketing: 'error',
}
export const ConvertRole: Record<string, number> = {
    admin: 1,
    root: 2,
    manager: 3,
    staff: 5,
    marketing: 6,
}