// src/lib/utils.ts
// Shared helpers used across the public site and dashboard.

/**
 * Format an INR amount with the rupee symbol and thousands separators.
 * 1234 → "₹1,234"
 * 1234.5 → "₹1,234.50"
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format a pack size in grams to human-readable.
 * 250 → "250 g"
 * 1000 → "1 kg"
 */
export function formatPackSize(grams: number): string {
  if (grams >= 1000) {
    const kg = grams / 1000;
    return `${kg % 1 === 0 ? kg : kg.toFixed(2)} kg`;
  }
  return `${grams} g`;
}

/**
 * Build a wa.me deep-link URL with a pre-filled message.
 * Number must be in international format without '+' or spaces.
 */
export function buildWhatsAppLink(
  phoneNumber: string,
  message: string
): string {
  const cleanNumber = phoneNumber.replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
}

/**
 * Check if a seasonal product is available right now based on its
 * available_months array (1-indexed: Jan=1, Dec=12).
 */
export function isAvailableNow(availableMonths: number[] | null): boolean {
  if (!availableMonths || availableMonths.length === 0) return true;
  const currentMonth = new Date().getMonth() + 1;
  return availableMonths.includes(currentMonth);
}

/**
 * Generate a human-readable order number.
 * FH-2026-0001 format.
 */
export function generateOrderNumber(sequence: number): string {
  const year = new Date().getFullYear();
  const padded = String(sequence).padStart(4, '0');
  return `FH-${year}-${padded}`;
}
