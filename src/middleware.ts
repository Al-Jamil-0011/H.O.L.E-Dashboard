import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const token = req.cookies.get("token")?.value;

    // 1. Skip static files and API routes
    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api") ||
        pathname.startsWith("/static") ||
        pathname === "/favicon.ico" ||
        pathname === "/logo.png"
    ) {
        return NextResponse.next();
    }

    // 2. Public Routes
    const publicRoutes = ["/auth/login", "/auth/register", "/auth/forgot-password", "/auth/verify-otp", "/auth/reset-password"];

    if (!token) {
        if (publicRoutes.includes(pathname)) {
            return NextResponse.next();
        }
        const loginUrl = new URL("/auth/login", req.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // 3. Logged in user handling
    try {
        const decoded: any = jwt.decode(token);

        // Robust role extraction
        const rawRole = decoded?.role;
        const roleStr = String(rawRole || "").toLowerCase().trim();
        const isAdmin = roleStr.includes("admin");
        const isFinance = roleStr.includes("finance");

        const isResetPassword = decoded?.isResetPassword;

        // Handle password reset
        if (isResetPassword) {
            if (["/auth/reset-password", "/auth/verify-otp", "/auth/forgot-password"].includes(pathname)) {
                return NextResponse.next();
            }
            return NextResponse.redirect(new URL("/auth/reset-password", req.url));
        }

        // Prevent access to public routes if logged in
        if (publicRoutes.includes(pathname)) {
            const target = isAdmin ? "/admin/dashboard" : isFinance ? "/finance/dashboard" : "/dashboard";
            return NextResponse.redirect(new URL(target, req.url));
        }

        // Handle root
        if (pathname === "/") {
            const target = isAdmin ? "/admin/dashboard" : isFinance ? "/finance/dashboard" : "/dashboard";
            return NextResponse.redirect(new URL(target, req.url));
        }

        // Base redirects for folder roots to point to default pages
        if (pathname === "/admin" || pathname === "/admin/settings") {
            return NextResponse.redirect(new URL("/admin/settings/view-profile", req.url));
        }
        if (pathname === "/finance" || pathname === "/finance/settings" || pathname === "/finance/settings/") {
            return NextResponse.redirect(new URL("/finance/settings/view-profile", req.url));
        }

        // ROLE PROTECTION
        if (pathname.startsWith("/admin")) {
            if (!isAdmin) {
                const target = isFinance ? "/finance/dashboard" : "/dashboard";
                return NextResponse.redirect(new URL(target, req.url));
            }
        }

        if (pathname.startsWith("/finance")) {
            if (!isFinance) {
                const target = isAdmin ? "/admin/dashboard" : "/dashboard";
                return NextResponse.redirect(new URL(target, req.url));
            }
        }

        return NextResponse.next();
    } catch (error) {
        console.error("MIDDLEWARE ERROR:", error);
        const response = NextResponse.redirect(new URL("/auth/login", req.url));
        response.cookies.delete("token");
        return response;
    }
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};