import { NextRequest, NextResponse } from 'next/server';
import acceptLanguage from 'accept-language';
import { fallbackLang, languages, cookieName } from './src/app/i18n/settings';

acceptLanguage.languages(languages);

export const config = {
  // Skip static files and API routes
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|.*\\..*).*)']
};

export function middleware(req: NextRequest) {
  // Get preferred language from cookie, header, or fallback
  let lang;
  if (req.cookies.has(cookieName)) {
    const cookieValue = req.cookies.get(cookieName)?.value;
    if (cookieValue) {
      lang = acceptLanguage.get(cookieValue);
    }
  }
  if (!lang) {
    const acceptLangHeader = req.headers.get('Accept-Language');
    if (acceptLangHeader) {
      lang = acceptLanguage.get(acceptLangHeader);
    }
  }
  if (!lang) lang = fallbackLang;

  // Redirect if language is not in path
  if (
    !languages.some(loc => req.nextUrl.pathname.startsWith(`/${loc}`)) &&
    !req.nextUrl.pathname.startsWith('/_next')
  ) {
    return NextResponse.redirect(new URL(`/${lang}${req.nextUrl.pathname}`, req.url));
  }

  // Remember language from referer in cookie
  if (req.headers.has('referer')) {
    const refererUrl = new URL(req.headers.get('referer') || '');
    const langInReferer = languages.find((l) => refererUrl.pathname.startsWith(`/${l}`));
    const response = NextResponse.next();
    if (langInReferer) response.cookies.set(cookieName, langInReferer);
    return response;
  }

  return NextResponse.next();
} 