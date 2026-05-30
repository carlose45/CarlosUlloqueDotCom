import { site } from '../../config/site';

export function absoluteUrl(path = '/'): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return new URL(normalizedPath, site.url).toString();
}

export function canonicalUrl(pathname: string): string {
  const path = pathname === '/index.html' ? '/' : pathname;
  return absoluteUrl(
    path.endsWith('/index.html') ? path.replace('/index.html', '/') : path,
  );
}
