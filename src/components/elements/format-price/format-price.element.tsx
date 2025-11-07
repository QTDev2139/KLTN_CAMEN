export const FormatPrice = (value: number | string | null | undefined) => {
  const num = Number(value) || 0; 
  return num.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};
