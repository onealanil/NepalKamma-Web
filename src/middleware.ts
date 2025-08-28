import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'ne'];
const defaultLocale = 'ne';

function getLocale(request: NextRequest): string {
  const pathname = request.nextUrl.pathname;
  const pathnameLocale = locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameLocale) return pathnameLocale;

  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const preferredLocale = acceptLanguage
      .split(',')[0]
      .split('-')[0];
    
    if (locales.includes(preferredLocale)) {
      return preferredLocale;
    }
  }

  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  const pathSegments = pathname.split('/');
  if (pathSegments[1] && !locales.includes(pathSegments[1]) && !pathname.startsWith('/dashboard') && !pathname.startsWith('/auth') && !pathname.startsWith('/api')) {
    const newPath = `/${defaultLocale}${pathname}`;
    return NextResponse.redirect(new URL(newPath, request.url));
  }

  if (pathname.startsWith('/dashboard')) {
    const refreshToken = request.cookies.get('refreshToken')?.value;

    if (!refreshToken) {
      const response = NextResponse.redirect(new URL('/auth/signin', request.url));
      response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      response.headers.set('Pragma', 'no-cache');
      response.headers.set('Expires', '0');
      return response;
    }
    
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  }

  if (pathname === '/' || (!pathnameHasLocale && pathname === '/')) {
    const locale = getLocale(request);
    const url = new URL(`/${locale}${pathname === '/' ? '' : pathname}`, request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|api|favicon.ico|images|.*\\.).*)',
    '/dashboard/:path*'
  ]
};
