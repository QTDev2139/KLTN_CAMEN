import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { OverviewFilterProps } from '~/pages/dashboard/screen/overview/overview.screen';

dayjs.extend(isoWeek);
export const formatDate = (value?: string | Date | null): string => {
  if (!value) return '';
  return dayjs(value).subtract(7, 'hour').format('DD/MM/YYYY');
};

export const formatDateTime = (value?: string | Date | null): string => {
  if (!value) return '';
  return dayjs(value).subtract(7, 'hour').format('DD/MM/YYYY HH:mm:ss');
};

export const today = dayjs().format('YYYY-MM-DD');
export const todayDateTime = dayjs().format('DD/MM/YYYY HH:mm:ss');

export const firstDayOfMonth = dayjs().subtract(7, 'hour').startOf('month').format('YYYY-MM-DD');

export const currentTime = dayjs().subtract(7, 'hour').format('DD/MM/YYYY HH:mm:ss');

export const getDefaultDates = () => {
  const now = dayjs();
  const startDate = now.add(1, 'day').subtract(7, 'hour').startOf('day').format('YYYY-MM-DDTHH:mm');
  const endDate = now.add(7, 'day').subtract(7, 'hour').endOf('day').format('YYYY-MM-DDTHH:mm');

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


// Function to calculate date range based on filter type
export const getDateRange = (filter: OverviewFilterProps): { startDate: string; endDate: string } => {
  const today = dayjs();

  const fmt = (d: dayjs.Dayjs) => d.format('YYYY-MM-DD');

  switch (filter.filterType) {
    case 'day':
      return {
        startDate: fmt(today),
        endDate: fmt(today),
      };

    case 'week': {
      const start = today.startOf('isoWeek'); // Monday
      return {
        startDate: fmt(start),
        endDate: fmt(today),
      };
    }

    case 'month': {
      const start = today.startOf('month');
      return {
        startDate: fmt(start),
        endDate: fmt(today),
      };
    }

    case 'year': {
      const start = today.startOf('year');
      return {
        startDate: fmt(start),
        endDate: fmt(today),
      };
    }

    case 'custom': {
      const hasStart = !!filter.startDate && dayjs(filter.startDate).isValid();
      const hasEnd = !!filter.endDate && dayjs(filter.endDate).isValid();

      if (hasStart && hasEnd) {
        return {
          startDate: fmt(dayjs(filter.startDate!)),
          endDate: fmt(dayjs(filter.endDate!)),
        };
      }
      if (hasStart) {
        return {
          startDate: fmt(dayjs(filter.startDate!)),
          endDate: fmt(today),
        };
      }
      return {
        startDate: fmt(today),
        endDate: fmt(today),
      };
    }

    default:
      return {
        startDate: fmt(today),
        endDate: fmt(today),
      };
  }
};
