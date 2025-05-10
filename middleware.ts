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
      // Map roles to their root directories
      const roleRootPaths = {
        1: '/studentstuff',
        2: '/teacherstuff',
        3: '/ownerstuff',
        4: '/adminstuff'
      };

      const allowedRoot = roleRootPaths[payload.role as keyof typeof roleRootPaths];
      
      // Redirect if trying to access wrong directory
      if (!path.startsWith(allowedRoot)) {
        // Special case for dashboard root, we use this route for login frontend, i am too lazy to tamper with it right now
        if (path === '/dashboards/owner' || path === '/dashboards/student' || path === '/dashboards/teacher'|| path === '/dashboards') {
          return NextResponse.redirect(new URL(allowedRoot, request.url));
        }
        
        // Block access to other role directories
        const isTryingToAccessOtherRoleDir = Object.values(roleRootPaths)
          .some(dir => path.startsWith(dir) && dir !== allowedRoot);

        if (isTryingToAccessOtherRoleDir) {
          return NextResponse.redirect(new URL(allowedRoot, request.url));
        }
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


/*Middleware in Next.js sits before your app’s rendering logic—whether that’s an SSR page, a static page, or a client‑side transition. Here’s how it weaves into the overall flow:

    Incoming HTTP Request

        Browser requests GET /teacherstuff/123/modules or any URL in your app.

    Edge Middleware Runs First

        Next.js hands the raw NextRequest to your middleware() function (running at the edge).

        Your code can inspect cookies, headers, path, etc., then decide to:

            return NextResponse.next() → let the request continue to rendering

            return NextResponse.redirect(...) → send back a 3xx response immediately

            return NextResponse.rewrite(...) → silently change the path that will be rendered

            return NextResponse.error() → send a 500

    Static File Check

        If you called NextResponse.next(), the router next checks if the URL maps to a static asset (/public/*) or a file in public/. If so, it serves that directly.

    Routing & Data Fetch

        If not a static file, Next matches the URL to a page in your /app or /pages directory.

        For App Router, it begins server‑component rendering (or serves an SSG/ISR snapshot if enabled).

    Server‑Component Rendering

        Any Server Components, data‑fetch calls, or getServerSideProps run now, producing HTML + flight payload.

    Response Sent

        The HTML starts streaming back to the client, along with the minimal JS needed to hydrate client components.

    Client Hydration

        Once the browser downloads your JS bundles, React hydrates the HTML into a fully interactive app.

    Client‑Side Transitions

        If you click a <Link>, Next fetches only the new Flight JSON, bypasses middleware on that transition (only the edge middleware in app/middleware.ts reruns if the path changes), and patches the UI client‑side—no full refresh.

Why Middleware First?

    Security: Block unauthorized users early, before any page or data‑fetch runs.

    Performance: Edge functions run geographically close to the user, making redirections or rewrites lightning fast.

    Simplicity: Centralizes auth, A/B tests, redirects, or feature‑flag logic in one place, separate from your page code.

By intercepting requests at the edge before routing or data‑fetching, middleware ensures that only valid, authorized traffic ever reaches your React rendering pipeline. 


a jwt is at the most simple level three parts a header, payload and a signature  <header>.<payload>.<signature>
the header is a json object that contains two parts, the type of token and the signing algorithm being used. for example if we use HMAC SHA256 as our signing algorithm, then
the header can look like this:
{
  "alg": "HS256", // algorithm used to sign the token most common is HMAC SHA256
  "typ": "JWT"
}
the payload is the data we want to send, in this case it is the user id and role of the user, this is what we use to determine what routes they can access
example payload:
{
  "user_id": 123,
  "role": 2
  "iat": 1633072800, // issued at time in seconds since epoch
  "exp": 1633076400 // expiration time in seconds since epoch
}
the signature is used to verify that the sender of the jwt is who it says it is and to ensure that the message wasn't changed along the way. To create the signature part, you have to take the encoded header, the encoded payload, a secret, and the algorithm specified in the header and sign that.
For example if we use HMAC SHA256 the signature will look like this:
HMACSHA256(
  base64UrlEncode(header) + "." +base64UrlEncode(payload),
  secret)
the secret is stored in our .env file and is used to sign the token when we create it, and to verify it when we decode it. 
when you concatenate the header and payload you get a string that looks like this:
eyJhbGci
since it was signed with the secret, you can verify that the sender of the JWT is who it says it is and to ensure that the message wasn't changed along the way.
how do we know that it wasnt changed along the way? well we can verify the signature and use the algorithm and secret that we used to create the token to create a new signature and compare it to the one that was sent. if they match, then we know that the token is valid and has not been tampered with.
when we create the token we use the jsonwebtoken library to sign it, and when we decode it we use the jose library to verify it.
the jose library is a more modern library that is compatible with the edge runtime, while jsonwebtoken is not. 
the jose library uses the same algorithm as jsonwebtoken to verify the token, so we can use it to verify the token we created with jsonwebtoken.
the jose library also has a built in function to decode the token, which we use to get the payload and verify the token at the same time.

    User logs in
    Your server verifies the credentials (e.g. via Passport’s Local Strategy), then issues a JWT signed with a server‑side secret.

    Client stores the token
    Usually in an HttpOnly cookie or localStorage.

    Authenticated requests
    On each subsequent request, the client sends the JWT—either in the Authorization: Bearer … header or as a cookie.

    Server verifies
    Middleware (e.g. Passport‑JWT or jose) checks the signature and claims (expiration, issuer). If valid, it loads req.user and proceeds; otherwise it rejects the request.

🔐 Why It’s Secure

    Integrity: Because the token is signed, you can detect any tampering.

    Stateless: No server‑side session store required; all auth info is in the token.

    Scoped: You control what claims you include—user roles, permissions, tenant IDs, etc.

    Expiration: Tokens carry their own expiry (exp claim), so they automatically become invalid.

📋 When to Use

    Single Sign‑On (SSO) across multiple domains or microservices.

    APIs where you prefer stateless, high‑performance auth.

    Mobile clients that need a lightweight, self‑contained credential.
*/