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

    // If there is no session or user is not logged in, redirect to login page
    if (!session) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Role-based access control
    if (pathname.startsWith("/admin")) {
      // Only allow Admins to access the /admin path
      if (session.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/403", req.url)); // Custom "Access Denied" page
      }
    } else if (pathname.startsWith("/lessor")) {
      // Only allow Lessors to access the /lessor path
      if (session.role !== "LESSOR") {
        return NextResponse.redirect(new URL("/403", req.url)); // Custom "Access Denied" page
      }
    } else if (pathname.startsWith("/lessee")) {
      // Only allow Lessees to access the /lessee path
      if (session.role !== "LESSEE") {
        return NextResponse.redirect(new URL("/403", req.url)); // Custom "Access Denied" page
      }
    }

    // For all other users, allow the request to proceed
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Ensure the user is authenticated
    },
  }
);

// Define routes that require authentication and role-based access
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
    "/subscription/:path*",
    "/profile",
    "/messages",
  ],
};
