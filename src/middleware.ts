import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // ✅ خلي الـ middleware يعدي كل حاجة
  // الـ auth بيتعمل في AuthContext مش هنا
  return NextResponse.next();
}

export const config = {
  matcher: [],
};