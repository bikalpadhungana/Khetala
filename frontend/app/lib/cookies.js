/**
 * Cookie utility for auth token management.
 *
 * Tokens are stored in a JS-readable cookie so that:
 *  1. Next.js Edge middleware can gate routes before any React renders.
 *  2. The Axios interceptor can still read the token client-side.
 *
 * The cookie is NOT httpOnly (we need client JS access), but is
 * Secure + SameSite=Lax in production.
 */

const COOKIE_NAME = 'accessToken';
const COOKIE_MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 7 days — matches JWT_EXPIRES_IN

/**
 * Set the auth token cookie.
 * @param {string} token - JWT access token
 */
export function setAuthCookie(token) {
  if (typeof document === 'undefined') return;

  const isSecure = window.location.protocol === 'https:';
  const parts = [
    `${COOKIE_NAME}=${encodeURIComponent(token)}`,
    `path=/`,
    `max-age=${COOKIE_MAX_AGE_SECONDS}`,
    `SameSite=Lax`,
  ];

  if (isSecure) {
    parts.push('Secure');
  }

  document.cookie = parts.join('; ');
}

/**
 * Read the auth token from the cookie.
 * @returns {string|null}
 */
export function getAuthCookie() {
  if (typeof document === 'undefined') return null;

  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${COOKIE_NAME}=`));

  if (!match) return null;
  return decodeURIComponent(match.split('=')[1]);
}

/**
 * Remove the auth token cookie.
 */
export function removeAuthCookie() {
  if (typeof document === 'undefined') return;

  // Setting max-age=0 deletes the cookie
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
}
