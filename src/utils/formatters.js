/**
 * Formats a date string (YYYY-MM-DD) into a human readable format
 * e.g., '2026-10-12' -> 'Mon, Oct 12, 2026'
 */
export function formatDate(dateString) {
  if (!dateString) return '—';
  try {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
}

/**
 * Formats currency values
 * e.g., 150 -> '$150'
 */
export function formatCurrency(amount) {
  if (typeof amount !== 'number') return '$0';
  return `$${amount.toLocaleString('en-US')}`;
}

/**
 * Generates an incremental or random appointment ID
 */
export function generateAppointmentId() {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `APT-${randomNum}`;
}

/**
 * Returns today's date formatted as YYYY-MM-DD
 */
export function getTodayString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
