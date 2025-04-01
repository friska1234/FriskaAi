import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    // Get auth token from cookies
    const authToken = req.cookies.get("userId")?.value;

    // If the user is authenticated and tries to access login, signup, forgot-password, or landing page, redirect to /chat
    if (
        authToken &&
        ["/auth/login", "/auth/signup", "/auth/forgot-password", "/"].includes(req.nextUrl.pathname)
    ) {
        return NextResponse.redirect(new URL("/chat", req.url));
    }

    // If the user is NOT authenticated and tries to access protected routes (chat), redirect to /
    if (!authToken && req.nextUrl.pathname.startsWith("/chat")) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    // Allow the request to continue if none of the above conditions are met
    return NextResponse.next();
}

// Apply middleware only on relevant routes
export const config = {
    matcher: ["/chat/:path*", "/auth/login", "/auth/signup", "/auth/forgot-password", "/"], // Protects chat and login/signup/forgot-password
};
