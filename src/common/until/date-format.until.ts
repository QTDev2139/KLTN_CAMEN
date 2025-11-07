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