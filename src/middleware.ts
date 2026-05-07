import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const token = req.cookies.get("token")?.value;

    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api") ||
        pathname === "/favicon.ico"
    ) {
        return NextResponse.next();
    }

    if (pathname === "/") {
        if (!token) {
            const loginUrl = req.nextUrl.clone();
            loginUrl.pathname = "/auth/login";
            return NextResponse.redirect(loginUrl);
        } else {
            const dashboardUrl = req.nextUrl.clone();
            dashboardUrl.pathname = "/dashboard";
            return NextResponse.redirect(dashboardUrl);
        }
    }

    if ((pathname.startsWith("/dashboard") || pathname.startsWith("/admin") || pathname.startsWith("/finance")) && !token) {
        const loginUrl = req.nextUrl.clone();
        loginUrl.pathname = "/auth/login";
        return NextResponse.redirect(loginUrl);
    }

    if (token && (pathname.startsWith("/auth/login") || pathname.startsWith("/auth/register") || pathname.startsWith("/auth/forgot-password") || pathname.startsWith("/auth/reset-password"))) {
        const dashboardUrl = req.nextUrl.clone();
        dashboardUrl.pathname = "/dashboard";
        return NextResponse.redirect(dashboardUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};