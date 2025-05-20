/**
 * 
 * @param arr 
 * @returns 
 */
export function sortByCreatedAtAsc<T extends ItemWithCreatedAt>(arr: T[]): T[] {
    return [...arr].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

/**
 * 
 * @param arr 
 * @returns 
 */
export function sortByCreatedAtDesc<T extends ItemWithCreatedAt>(arr: T[]): T[] {
    return [...arr].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * sortByString(data, 'name', false); // Z-A
 * sortByString(data, 'name', true); // A-Z
 * @param arr array
 * @param key key
 * @param ascending 
 * @returns 
 */
export function sortByString<T>(arr: T[], key: keyof T, ascending: boolean = true): T[] {
    return [...arr].sort((a, b) => {
        const valA = (a[key] as string).toLowerCase();
        const valB = (b[key] as string).toLowerCase();
        return ascending ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });
}

/**
 * 
 * @param arr 
 * @param key 
 * @param ascending 
 * sortByNumber(data, 'price', true); // tăng
 * sortByNumber(data, 'price', false); // giảm
 * @returns 
 */
export function sortByNumber<T>(arr: T[], key: keyof T, ascending: boolean = true): T[] {
    return [...arr].sort((a, b) => {
        const valA = Number(a[key]);
        const valB = Number(b[key]);
        return ascending ? valA - valB : valB - valA;
    });
}

/**
 * filterByField(data, 'status', 'ACTIVE');
 * filterByField(users, 'isVerified', true);
 * @param arr 
 * @param key status hoặc boolean flag
 * @param value 
 * @returns 
 */
export function filterByField<T>(arr: T[], key: keyof T, value: any): T[] {
    return arr.filter((item) => item[key] === value);
}

/**
 * filterByKeyword(users, 'name', 'John');
 * @param arr 
 * @param key 
 * @param keyword 
 * @returns 
 */
export function filterByKeyword<T>(arr: T[], key: keyof T, keyword: string): T[] {
    const lowerKeyword = keyword.toLowerCase();
    return arr.filter((item) =>
        String(item[key]).toLowerCase().includes(lowerKeyword)
    );
}

/**
 * Nhóm theo thuộc tính (Group By)
 * @param list 
 * @param key 
 * @returns 
 */
export const groupBy = <T, K extends keyof T>(
    list: T[],
    key: K
): Record<string, T[]> => {
    return list.reduce((result, item) => {
        const groupKey = String(item[key]);
        result[groupKey] = result[groupKey] || [];
        result[groupKey].push(item);
        return result;
    }, {} as Record<string, T[]>);
};

/**
 *  Debounce (chống spam gọi API)
 * @param func 
 * @param delay 
 * @returns 
 */
export const debounce = <F extends (...args: any[]) => void>(
    func: F,
    delay: number
): ((...args: Parameters<F>) => void) => {
    let timer: NodeJS.Timeout;
    return (...args: Parameters<F>) => {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), delay);
    };
};

/**
 * Lấy duy nhất (unique)
 * @param list 
 * @param key 
 * @returns 
 */
export const getUnique = <T, K extends keyof T>(list: T[], key: K): T[] => {
    const seen = new Set();
    return list.filter(item => {
        const val = item[key];
        if (seen.has(val)) return false;
        seen.add(val);
        return true;
    });
};

/**
 * 
 * @param arr 
 * @returns 
 */
export function reverseArray<T>(arr: T[]): T[] {
  return [...arr].reverse();
}


