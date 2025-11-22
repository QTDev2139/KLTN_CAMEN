import dayjs from 'dayjs';

export const formatDate = (value?: string | Date | null): string => {
  if (!value) return '';
  return dayjs(value).format('DD/MM/YYYY');
};

export const formatDateTime = (value?: string | Date | null): string => {
  if (!value) return '';
  return dayjs(value).format('DD/MM/YYYY HH:mm:ss');
};

export const today = dayjs().format('YYYY-MM-DD');
export const firstDayOfMonth = dayjs().startOf('month').format('YYYY-MM-DD');

export const currentTime = dayjs().format('DD/MM/YYYY HH:mm:ss');

export const getDefaultDates = () => {
  const now = dayjs();
  const startDate = now.add(1, 'day').startOf('day').format('YYYY-MM-DDTHH:mm');
  const endDate = now.add(7, 'day').endOf('day').format('YYYY-MM-DDTHH:mm');

  return { startDate, endDate };
};

// chỉ giờ (HH:MM)
export const formatTime = (s?: string) => {
  if (!s) return '';
  const d = new Date(s);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
};

// header ngày dạng "22 Th11"
export const formatDateHeader = (s?: string) => {
  if (!s) return '';
  const d = new Date(s);
  const day = d.getDate();
  const month = d.getMonth() + 1;
  return `${day} Th${month}`;
};
