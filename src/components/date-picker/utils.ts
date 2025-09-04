import { MONTHNAMES } from './constants';
import type { DateRange } from './types';

// Formatear rango de fechas para el header
export const formatDateRange = (range: DateRange) => {
  if (!range.from && !range.to) {
    return 'Select Date Range';
  }

  if (range.from && !range.to) {
    const monthName = MONTHNAMES[range.from.getMonth()].slice(0, 3);
    const day = range.from.getDate();
    return `${monthName} ${day} - `;
  }

  if (!range.from && range.to) {
    const monthName = MONTHNAMES[range.to.getMonth()].slice(0, 3);
    const day = range.to.getDate();
    return `${monthName} ${day} - `;
  }

  if (range.from && range.to) {
    const fromMonthName = MONTHNAMES[range.from.getMonth()].slice(0, 3);
    const fromDay = range.from.getDate();

    const toMonthName = MONTHNAMES[range.to.getMonth()].slice(0, 3);
    const toDay = range.to.getDate();

    return `${fromMonthName} ${fromDay} - ${toMonthName} ${toDay}`;
  }

  return 'Select Date Range';
};
export const generateCalendarDays = (currentMonth: Date) => {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  // Primer día del mes
  const firstDay = new Date(year, month, 1);
  // Último día del mes
  const lastDay = new Date(year, month + 1, 0);
  // Último día del mes anterior
  const prevMonthLastDay = new Date(year, month, 0);

  // Día de la semana del primer día (0 = Domingo)
  const startDate = firstDay.getDay();

  // Total de días en el mes
  const daysInMonth = lastDay.getDate();

  const days = [];

  // Días del mes anterior
  for (let i = startDate - 1; i >= 0; i--) {
    days.push({
      day: prevMonthLastDay.getDate() - i,
      isCurrentMonth: false,
      isPrevMonth: true,
      date: new Date(year, month - 1, prevMonthLastDay.getDate() - i),
    });
  }

  // Días del mes actual
  for (let day = 1; day <= daysInMonth; day++) {
    days.push({
      day,
      isCurrentMonth: true,
      isPrevMonth: false,
      date: new Date(year, month, day),
    });
  }

  // Días del mes siguiente para completar la grilla (6 filas x 7 días = 42 días)
  const totalCells = 42;
  const remainingCells = totalCells - days.length;

  for (let day = 1; day <= remainingCells; day++) {
    days.push({
      day,
      isCurrentMonth: false,
      isPrevMonth: false,
      date: new Date(year, month + 1, day),
    });
  }

  return days;
};

// Verificar si un día está seleccionado (from o to)
export const isDaySelected = (
  dayData: {
    day: number;
    isCurrentMonth: boolean;
    isPrevMonth: boolean;
    date: Date;
  },
  dateRange: DateRange
) => {
  if (!dateRange.from && !dateRange.to) return false;

  // Normalizar fechas para comparar solo año, mes y día (sin tiempo)
  const dayNormalized = new Date(
    dayData.date.getFullYear(),
    dayData.date.getMonth(),
    dayData.date.getDate()
  );

  const fromNormalized = dateRange.from
    ? new Date(
        dateRange.from.getFullYear(),
        dateRange.from.getMonth(),
        dateRange.from.getDate()
      )
    : null;

  const toNormalized = dateRange.to
    ? new Date(
        dateRange.to.getFullYear(),
        dateRange.to.getMonth(),
        dateRange.to.getDate()
      )
    : null;

  const dayTime = dayNormalized.getTime();
  const fromTime = fromNormalized?.getTime();
  const toTime = toNormalized?.getTime();

  return dayTime === fromTime || dayTime === toTime;
};

// Verificar si un día está en el rango
export const isDayInRange = (
  dayData: {
    day: number;
    isCurrentMonth: boolean;
    isPrevMonth: boolean;
    date: Date;
  },
  dateRange: DateRange
) => {
  if (!dateRange.from || !dateRange.to) return false;

  // Normalizar fechas para comparar solo año, mes y día (sin tiempo)
  const dayNormalized = new Date(
    dayData.date.getFullYear(),
    dayData.date.getMonth(),
    dayData.date.getDate()
  );

  const fromNormalized = new Date(
    dateRange.from.getFullYear(),
    dateRange.from.getMonth(),
    dateRange.from.getDate()
  );

  const toNormalized = new Date(
    dateRange.to.getFullYear(),
    dateRange.to.getMonth(),
    dateRange.to.getDate()
  );

  const dayTime = dayNormalized.getTime();
  const fromTime = fromNormalized.getTime();
  const toTime = toNormalized.getTime();

  const minTime = Math.min(fromTime, toTime);
  const maxTime = Math.max(fromTime, toTime);

  return dayTime > minTime && dayTime < maxTime;
};

// Verificar si un día es hoy
export const isToday = (dayData: {
  day: number;
  isCurrentMonth: boolean;
  isPrevMonth: boolean;
  date: Date;
}) => {
  const today = new Date();
  const todayNormalized = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const dayNormalized = new Date(
    dayData.date.getFullYear(),
    dayData.date.getMonth(),
    dayData.date.getDate()
  );

  return todayNormalized.getTime() === dayNormalized.getTime();
};

export const generateYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear - 25; year <= currentYear; year++) {
    years.push(year);
  }
  return years;
};
