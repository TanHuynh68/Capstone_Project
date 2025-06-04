import moment from "moment";
import { format, formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

type DateInput = string | Date;

/**
 *
 * @param date
 * @returns
 */
export const formatDate = (date: string) => {
  return moment(date).format("DD/MM/YYYY");
};

export const formatDateToSubmit = (date: string) => {
  return moment(date).format("YYYY-MM-DD");
};

export const formatDayAndTime = (data: any) => {
  const date = new Date(data);

  // Cộng thêm 7 giờ (7 * 60 * 60 * 1000 milliseconds)
  const utcPlus7 = new Date(date.getTime() + 7 * 60 * 60 * 1000);

  const formatted = new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // Nếu bạn không muốn dùng AM/PM
  }).format(utcPlus7);

  return formatted;
};

/**
 *
 * @param response
 * @returns
 */
export const formatCreatedAt = (response: any) => {
  const sortedData = response.data.sort(
    (a: any, b: any) => moment(b.createdAt).unix() - moment(a.createdAt).unix()
  );
  return sortedData;
};

/**
 * Tính số ngày giữa 2 ngày (daysBetween)
 * @param start
 * @param end
 * @returns
 */
export const daysBetween = (
  start: string | Date,
  end: string | Date
): number => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diff = Math.abs(endDate.getTime() - startDate.getTime());
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

/**
 * Kiểm tra ngày có nằm trong tương lai (isFuture)
 * @param date
 * @returns
 */
export const isFuture = (date: string | Date): boolean => {
  return new Date(date).getTime() > Date.now();
};

/**
 * Trừ ngày (subtractDays)
 * @param date
 * @param days
 * @returns
 */
export const subtractDays = (date: string | Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
};

/**
 * Cộng ngày (addDays)
 * @param date
 * @param days
 * @returns
 */
export const addDays = (date: string | Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Kiểm tra ngày nằm trong khoảng (isDateInRange)
 * @param target
 * @param start
 * @param end
 * @returns
 */
export const isDateInRange = (
  target: string | Date,
  start: string | Date,
  end: string | Date
): boolean => {
  const d = new Date(target).getTime();
  return d >= new Date(start).getTime() && d <= new Date(end).getTime();
};

/**
 * Lấy ngày hôm nay (getToday)
 * @returns
 */
export const getToday = (): string => {
  return new Date().toISOString().split("T")[0]; // 👉 yyyy-mm-dd
};

/**
 * Lấy ngày theo format tự custom (dùng Intl.DateTimeFormat)
 * Ex:
 const today = new Date(); // VD: 2025-04-10
 customFormatDate(today, { 
  day: "2-digit",
  month: "2-digit",
  year: "numeric"
 }); 
 👉 "10/04/2025"
---------------------------
 customFormatDate(today, {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric"
}); 
// 👉 "Thứ năm, ngày 10 tháng 4 năm 2025"
---------------------------
 * @param date 
 * @param options 
 * @param locale 
 * @returns 
 */
export const customFormatDate = (
  date: string | Date,
  options?: Intl.DateTimeFormatOptions,
  locale = "vi-VN"
): string => {
  return new Intl.DateTimeFormat(locale, options).format(new Date(date));
};

export function formatDateTimeVN(isoString: string) {
  const date = new Date(isoString);
  const datePart = new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);

  const timePart = date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return `${datePart} ${timePart}`;
}


export function formatFullDateWithDistance(isoString: string) {
  const createdAt = new Date(isoString);

  const corrected = new Date(createdAt.getTime() + 25560000 - 2000);
  const now = new Date();

  const finalTime = corrected > now ? now : corrected;

  const formatted = format(finalTime, "dd/MM/yyyy HH:mm:ss");
  const relative = formatDistanceToNow(finalTime, {
    addSuffix: true,
    locale: vi,
  });

  return `${formatted} (${relative})`;
}

export function formatFullDateWithDistance2(isoString: string) {
  const createdAt = new Date(isoString);

  const corrected = new Date(createdAt.getTime() + 25560000 - 2000);
  const now = new Date();

  const finalTime = corrected > now ? now : corrected;

  const formatted = format(finalTime, "dd/MM/yyyy HH:mm:ss");
  // const relative = formatDistanceToNow(finalTime, {
  //     addSuffix: true,
  //     locale: vi,
  // });

  return `${formatted} `;
}

/**
 * Format date to UTC+7 (Vietnam timezone)
 * @param date - Date string or Date object
 * @param formatStr - Format string (default: "dd/MM/yyyy")
 * @returns Formatted date string in UTC+7
 */
export const formatVietnamDate = (date: DateInput, formatStr: string = "dd/MM/yyyy"): string => {
  const utcDate = new Date(date);
  // Convert to UTC+7 by adding 7 hours
  const vietnamDate = new Date(utcDate.getTime() + (7 * 60 * 60 * 1000));
  return format(vietnamDate, formatStr, { locale: vi });
};

export const formatVietnamDateHours = (date: DateInput, formatStr: string = "dd/MM/yyyy HH:mm:ss"): string => {
  const utcDate = new Date(date);
  // Convert to UTC+7 by adding 7 hours
  const vietnamDate = new Date(utcDate.getTime() + (7 * 60 * 60 * 1000));
  return format(vietnamDate, formatStr, { locale: vi });
};

export const formatVietnamDateHoursWithSuffix = (
  date: DateInput,
  formatStr: string = "dd/MM/yyyy HH:mm:ss"
): string => {
  const vietnamDate = new Date(new Date(date).getTime() + (7 * 60 * 60 * 1000));
  const formatted = format(vietnamDate, formatStr, { locale: vi });
  const relative = formatDistanceToNow(vietnamDate, { locale: vi, addSuffix: true });
  return `${formatted} (${relative})`;
};

/**
 * Format date to UTC+7 with full date format (Vietnam timezone)
 * Example: "15 tháng 3 năm 2024"
 */
export const formatVietnamFullDate = (date: DateInput): string => {
  return formatVietnamDate(date, "d 'tháng' M 'năm' yyyy");
};

/**
 * Convert date to UTC+7 timezone
 * @param date - Date string or Date object
 * @returns Date object in UTC+7
 */
export const toVietnamTime = (date: DateInput): Date => {
  const utcDate = new Date(date);
  return new Date(utcDate.getTime() + (7 * 60 * 60 * 1000));
}; 
