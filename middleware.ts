import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    // Get auth token from cookies
    const authToken = req.cookies.get("userId")?.value;

    // If the user is already authenticated and tries to access the login page, redirect them
    if (authToken && req.nextUrl.pathname === "/auth/login" || req.nextUrl.pathname === "/auth/signup" || req.nextUrl.pathname === "/auth/forgot-password" || req.nextUrl.pathname === "/") {
        return NextResponse.redirect(new URL("/chat", req.url));
    }

    if (!authToken && req.nextUrl.pathname.startsWith("/chat")) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // Allow the request to continue if none of the above conditions are met
    return NextResponse.next();
}

// Apply middleware only on protected routes (chat)
export const config = {
    matcher: ["/chat/:path*", "/auth/login","/auth/signup","/auth/forgot-password","/"], // Protects chat and login
};
