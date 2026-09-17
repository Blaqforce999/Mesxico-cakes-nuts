import { format } from 'date-fns';

/**
 * Formats an amount in kobo into a human-readable Naira string.
 * Example: 1500000 kobo -> ₦15,000
 */
export function formatNaira(amountKobo: number): string {
  const naira = Math.floor(amountKobo / 100);
  return `₦${naira.toLocaleString('en-NG')}`;
}

/**
 * Converts Naira to kobo integer.
 * Example: 15000 -> 1500000
 */
export function nairaToKobo(naira: number): number {
  return Math.round(naira * 100);
}

/**
 * Formats a date string or Date object for UI display.
 */
export function formatDisplayDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'EEEE, MMMM d, yyyy');
}

/**
 * Calculates the earliest allowable delivery date based on cart lead time.
 * If leadTimeHours is 48, customer must choose a date at least 2 full days from today.
 */
export function getEarliestDeliveryDate(leadTimeHours: number): string {
  const now = new Date();
  const daysToAdd = Math.ceil(leadTimeHours / 24);
  const minDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysToAdd);
  return minDate.toISOString().split('T')[0];
}
