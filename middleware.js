import { NextResponse } from 'next/server'

export function middleware(request) {
  const shareToken = request.nextUrl.searchParams.get('share')
  if (shareToken) {
    const url = request.nextUrl.clone()
    url.pathname = `/share/${encodeURIComponent(shareToken)}`
    url.searchParams.delete('share')
    return NextResponse.redirect(url)
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|api|favicon|icon).*)'],
}
