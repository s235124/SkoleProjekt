import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose"; // jsonwebtoken is edge runtime which is incompatible with next, jose is an alternative for verifying these so called json web tokens
import { env } from './env.mjs';

const public_routes = ["/", "/signup"];

export async function middleware(request: NextRequest) {

  const token = request.cookies.get('token')?.value; // when logging in we set a jsonwebtoken in cookies, this line of code extracts that token


  const path = request.nextUrl.pathname; // path is the current route we are trying to acces for example dashboards/student
  
  const PUBLIC_FILE = /\.(.*)$/; //middleware did some foul stuff to css this line fixed it, courtesy of deepseek victory

  if (PUBLIC_FILE.test(path)) return NextResponse.next();

  try {
    // this if condition prevents users who are already logged in from going to the login screen, instead it redirects them to their dashboard, by recursively triggering this function
    if (token && public_routes.includes(path)) {
      return NextResponse.redirect(new URL('/dashboards', request.url));
    }

    // if someone tries to access a route that isnt "public" and they dont have a token (they didnt login) we redirect them to signup
    if (!public_routes.includes(path)) {
      if (!token) {
        return NextResponse.redirect(new URL('/signup', request.url));
      }

      // Verify token with jose
      const { payload } = await jwtVerify(
        token!,//"!" to assert non-null
        new TextEncoder().encode(env.JWT_SECRET!)  //the jwt_secret is for decrypting our tokens its a sort of key for the tokens
      );

      //key value pairs
      const roleDashboardPaths = {
        1: '/dashboards/student',
        2: '/dashboards/teacher',
        3: '/dashboards/owner',
        4: '/dashboards/admin',
      };
      
      
      //we figure out which path is allowed for the user based on their token by using their role
      const allowedPath = roleDashboardPaths[payload.role as keyof typeof roleDashboardPaths];
    
      //if the path that the user tried to access is a dashboard, but it isnt their allowedPath, we redirect them to their allowed path
      if (path.startsWith('/dashboards') && !path.startsWith(allowedPath)) {
        return NextResponse.redirect(new URL(allowedPath, request.url));
      }
    }
  } catch (error) { //error catch meh
    console.error("middleware be cookin errors ", error);
    const response = NextResponse.redirect(new URL('/signup', request.url));
    response.cookies.delete('token');
    return response;
  }

  return NextResponse.next();
}