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

