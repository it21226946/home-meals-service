/**
 * Backend base URL from Expo env. Copy frontend/.env.example to frontend/.env and set EXPO_PUBLIC_API_URL.
 */
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? '';

export function getApiBaseUrl(): string {
  const url = API_BASE_URL.trim();
  if (!url) {
    throw new Error(
      'EXPO_PUBLIC_API_URL is not set. Copy frontend/.env.example to frontend/.env and set your backend URL.'
    );
  }
  return url.replace(/\/$/, '');
}
