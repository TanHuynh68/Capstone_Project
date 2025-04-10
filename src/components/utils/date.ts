import moment from "moment"
/**
 * 
 * @param date 
 * @returns 
 */
export const formatDate = (date: string) => {
    return moment(date).format("DD/MM/YYYY");
}

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
}

/**
 * Tính số ngày giữa 2 ngày (daysBetween)
 * @param start 
 * @param end 
 * @returns 
 */
export const daysBetween = (start: string | Date, end: string | Date): number => {
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
