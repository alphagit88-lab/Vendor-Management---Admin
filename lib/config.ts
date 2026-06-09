export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export function isBackendUpload(path: string): boolean {
  if (!path) return false;
  return path.startsWith('/uploads/') || path.includes('/uploads/');
}

export function resolveMediaUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('/uploads/')) return `${API_BASE_URL}${path}`;
  return path;
}
