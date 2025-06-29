
import { NextResponse } from "next/server";

export async function middleware(request) {
  const session = request.cookies.get("session");

  // Return to /login if don't have a session
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Call the authentication endpoint
    let responseAPI;
    try {
      responseAPI = await fetch(`${request.nextUrl.origin}/api/auth`, {
        headers: {
          Cookie: `session=${session?.value}`,
        },
      });
    } catch (error) {
      console.error("Error fetching auth API:", error);
      return NextResponse.redirect(new URL("/login", request.url));
    }

  // Return to /login if token is not authorized
  if (responseAPI.status !== 200) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

//Add your protected routes
export const config = {
  matcher: ["/"],
};
