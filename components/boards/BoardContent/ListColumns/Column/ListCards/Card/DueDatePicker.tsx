'use client';

import Image from 'next/image';
import { DatePicker as AntdDatePicker } from 'antd';
import dayjs from 'dayjs';
import Images from '@/assets';

interface DueDatePickerProps {
  value?: string | null;
  overdue?: boolean;
  disabled?: boolean;
  onChange: (date: string | null) => void;
}

const formatDueDate = (dateStr: string): string =>
  dayjs(dateStr).format('DD/MM');

function DueDatePicker({
  value,
  overdue,
  disabled,
  onChange,
}: DueDatePickerProps) {
  const dayjsValue = value ? dayjs(value) : null;

  return (
    <div
      className="relative inline-flex"
      data-no-dnd
      onClick={e => e.stopPropagation()}
    >
      <span
        className={`flex items-center gap-1 rounded px-2 py-0.5 text-xs font-semibold ${
          value
            ? overdue
              ? 'bg-red-100 text-red-600'
              : 'bg-theme-neutral-3 text-theme-neutral-8'
            : 'text-theme-neutral-6 opacity-60 hover:opacity-100'
        }`}
        title={value ? (overdue ? 'Đã quá hạn' : 'Hạn chót') : 'Đặt hạn chót'}
      >
        <Image
          src={Images.IconCalendar}
          alt="calendar"
          width={14}
          height={14}
        />
        {value && formatDueDate(value)}
      </span>

      {/* Transparent picker overlays the badge so a click opens the calendar */}
      <AntdDatePicker
        value={dayjsValue}
        onChange={date => onChange(date ? date.format('YYYY-MM-DD') : null)}
        disabled={disabled}
        allowClear={false}
        suffixIcon={null}
        format="YYYY/MM/DD"
        getPopupContainer={() => document.body}
        className="!absolute !inset-0 !h-full !w-full !min-w-0 !cursor-pointer !border-0 !bg-transparent !p-0 !opacity-0"
      />
    </div>
  );
}

export default DueDatePicker;
