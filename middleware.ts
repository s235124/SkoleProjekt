import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose"; // jsonwebtoken is edge runtime which is incompatible with next, jose is an alternative for verifying these so called json web tokens
import { env } from './env.mjs';

const public_routes = ["/", "/signup"];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const path = request.nextUrl.pathname;
  const PUBLIC_FILE = /\.(.*)$/; //middleware did some foul stuff to css this line fixed it, courtesy of deepseek victory

  if (PUBLIC_FILE.test(path)) return NextResponse.next();

  try {
    if (token && public_routes.includes(path)) {
      return NextResponse.redirect(new URL('/dashboards', request.url));
    }

    if (!public_routes.includes(path)) {
      if (!token) {
        return NextResponse.redirect(new URL('/signup', request.url));
      }

      // Verify token with jose
      const { payload } = await jwtVerify(
        token!,//"!" to assert non-null
        new TextEncoder().encode(env.JWT_SECRET!) 
      );

      const roleDashboardPaths = {
        1: '/dashboards/student',
        2: '/dashboards/teacher',
        3: '/dashboards/owner',
        4: '/dashboards/admin',
      };

      const allowedPath = roleDashboardPaths[payload.role as keyof typeof roleDashboardPaths];

      if (path.startsWith('/dashboards') && !path.startsWith(allowedPath)) {
        return NextResponse.redirect(new URL(allowedPath, request.url));
      }
    }
  } catch (error) {
    console.error("middleware be cookin erros ", error);
    const response = NextResponse.redirect(new URL('/signup', request.url));
    response.cookies.delete('token');
    return response;
  }

  return NextResponse.next();
}