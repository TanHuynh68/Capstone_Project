export const convertToPixels = (value: number, unit: string) => {
    const dpi = 96; // giả sử 96dpi
    if (unit === 'cm') return (value * dpi) / 2.54;
    if (unit === 'mm') return (value * dpi) / 25.4;
    return value;
};
