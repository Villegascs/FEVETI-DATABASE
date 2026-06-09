'use client';

import * as React from 'react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import * as Popover from '@radix-ui/react-popover';
import styles from './DatePicker.module.css';

interface DatePickerProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  className?: string;
}

export function DatePicker({ value, onChange, placeholder = 'Seleccionar fecha', id, className = '' }: DatePickerProps) {
  // Manejamos el valor de la fecha. 
  // 'value' viene en formato 'yyyy-MM-dd' típicamente de inputs type="date".
  const date = value ? parseISO(value) : undefined;

  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const formatted = format(selectedDate, 'yyyy-MM-dd');
      onChange(formatted);
    } else {
      onChange('');
    }
  };

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          id={id}
          className={`${styles.trigger} ${!date ? styles.muted : ''} ${className}`}
        >
          <CalendarIcon className={styles.icon} size={16} />
          {date ? format(date, 'PPP', { locale: es }) : <span>{placeholder}</span>}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className={styles.content} align="start" sideOffset={4}>
          <div className={styles.calendarWrapper}>
            <DayPicker
              mode="single"
              selected={date}
              onSelect={handleSelect}
              locale={es}
              showOutsideDays
              captionLayout="dropdown"
              startMonth={new Date(1940, 0)}
              endMonth={new Date(2050, 11)}
            />
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
