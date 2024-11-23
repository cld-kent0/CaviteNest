// export { default } from "next-auth/middleware";

// export const config = {
//   matcher: ["/trips", "/reservations", "/properties", "/favorites"],
// };

import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {
    const { pathname } = req.nextUrl;

    const session = await getToken({ req });

    // If there is no session, redirect to the login page
    if (!session) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Role-based access control for the /admin route
    if (pathname.startsWith("/admin")) {
      // Only allow Admins to access the /admin path
      if (session.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/403", req.url)); // Custom "Access Denied" page
      }
    }

    // Allow Lessors and Lessees to access all other paths
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Ensure the user is authenticated
    },
  }
);

// Define routes that require authentication
export const config = {
  matcher: [
    "/admin/:path*",
    "/lessor/:path*",
    "/lessee/:path*",
    "/trips",
    "/reservations",
    "/properties",
    "/favorites",
    "/subscription",
    "/profile",
    "/subscription/:path*",
  ],
};

