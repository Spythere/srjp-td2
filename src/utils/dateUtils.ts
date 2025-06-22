const romanMonthDigits = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

export function parseTimetableRunDate(date: Date) {
  return `${date.getDate()}.${romanMonthDigits[date.getMonth()]}.${date
    .getFullYear()
    .toString()
    .slice(2)}`;
}
