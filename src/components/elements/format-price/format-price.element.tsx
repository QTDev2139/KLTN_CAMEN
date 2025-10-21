export const FormatPrice = (number: number) => {
  return number.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};