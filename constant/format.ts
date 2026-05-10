import dayjs from 'dayjs';

export const format = {
  date: (v?: string | number | null) =>
    v ? dayjs(v).format('YYYY/MM/DD') : '—',
  dateInput: (v?: string | number | null) =>
    v ? dayjs(v).format('YYYY-MM-DD') : '',
  dateTime: (v?: string | number | null) =>
    v ? dayjs(v).format('YYYY/MM/DD HH:mm:ss') : '—',
  shortKey: (id?: string) => (id ? id.slice(-6).toUpperCase() : ''),
  hours: (v?: string | number | null) => (v ? `${v}h` : '—'),
};
