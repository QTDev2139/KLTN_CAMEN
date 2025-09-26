// utils/slug.ts
export function toSlug(input: string): string {
  return input
    .normalize('NFD')                      // tách dấu
    .replace(/[\u0300-\u036f]/g, '')       // remove dấu
    .replace(/đ/g, 'd').replace(/Đ/g, 'D') // đ -> d
    .replace(/[^a-zA-Z0-9\s-]/g, '')       // bỏ ký tự lạ
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase();
}

export function genTranslationKey(): string {
  // đơn giản: 16 ký tự base36
  return Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 10);
}
