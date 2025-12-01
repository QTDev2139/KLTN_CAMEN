
export const slugify = (s: string) =>
  s
    .normalize('NFD') // tách dấu
    .replace(/[\u0300-\u036f]/g, '') // xoá dấu
    .toLowerCase()
    .replace(/đ/g, 'd') // đ -> d
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');