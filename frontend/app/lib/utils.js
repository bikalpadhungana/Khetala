import { clsx } from 'clsx';

/**
 * Merge class names — combines clsx for conditional classes
 * @param  {...string} inputs - Class name strings or conditional objects
 * @returns {string} Merged class string
 */
export function cn(...inputs) {
  return clsx(inputs);
}

/**
 * Format currency in NPR
 * @param {number} amount
 * @returns {string} Formatted string like "NPR 12,500"
 */
export function formatNPR(amount) {
  return `NPR ${amount.toLocaleString('en-IN')}`;
}

/**
 * Format a number with commas
 * @param {number} num
 * @returns {string}
 */
export function formatNumber(num) {
  return num.toLocaleString('en-IN');
}

/**
 * Get initials from a full name
 * @param {string} name - Full name like "Ram Bahadur"
 * @returns {string} Initials like "RB"
 */
export function getInitials(name) {
  if (!name) return '';
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0].toUpperCase())
    .slice(0, 2)
    .join('');
}

/**
 * Format a date string to a readable format
 * @param {string|Date} date
 * @returns {string} Like "Jan 15, 2025"
 */
export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format relative time (e.g., "2 hours ago")
 * @param {string|Date} date
 * @returns {string}
 */
export function timeAgo(date) {
  const now = new Date();
  const then = new Date(date);
  const seconds = Math.floor((now - then) / 1000);

  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(date);
}

/**
 * Truncate text with ellipsis
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export function truncate(text, maxLength = 50) {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '…';
}

/**
 * Generate a unique ID (for demo/mock purposes)
 * @param {string} prefix
 * @returns {string}
 */
export function generateId(prefix = 'id') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}
