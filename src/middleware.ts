import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {

    const { pathname } = req.nextUrl;

    const token = req.cookies.get("token")?.value;



    const publicRoutes = [
        "/auth/login",
        "/auth/register",
        "/auth/forgot-password",
        "/auth/verify-otp",
        "/auth/reset-password",
    ];


    const blockedWhenLoggedIn = [
        "/auth/login",
        "/auth/register",
    ];



    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api") ||
        pathname === "/favicon.ico"
    ) {
        return NextResponse.next();
    }

    if (!token) {

        // allow public routes
        if (publicRoutes.includes(pathname)) {
            return NextResponse.next();
        }

        // otherwise redirect login
        const loginUrl = req.nextUrl.clone();
        loginUrl.pathname = "/auth/login";

        return NextResponse.redirect(loginUrl);
    }

    try {

        const decoded: any = jwt.decode(token);

        const role = decoded?.role;
        const isResetPassword = decoded?.isResetPassword;

        /**
         * RESET PASSWORD FLOW
         */

        if (isResetPassword) {

            // allow only recovery pages
            if (
                pathname === "/auth/reset-password" ||
                pathname === "/auth/verify-otp" ||
                pathname === "/auth/forgot-password"
            ) {
                return NextResponse.next();
            }

            // force reset-password
            const resetUrl = req.nextUrl.clone();
            resetUrl.pathname = "/auth/reset-password";

            return NextResponse.redirect(resetUrl);
        }

        /**
         * ROOT ROUTE
         */
        if (pathname.startsWith("/admin")) {

            if (role !== "admin") {

                const redirectUrl = req.nextUrl.clone();

                if (role === "finance") {
                    redirectUrl.pathname = "/finance/dashboard";
                } else {
                    redirectUrl.pathname = "/dashboard";
                }

                return NextResponse.redirect(redirectUrl);
            }
        }

        // finance routes
        if (pathname.startsWith("/finance")) {

            if (role !== "finance") {

                const redirectUrl = req.nextUrl.clone();

                if (role === "admin") {
                    redirectUrl.pathname = "/admin/dashboard";
                } else {
                    redirectUrl.pathname = "/dashboard";
                }

                return NextResponse.redirect(redirectUrl);
            }
        }

        if (pathname === "/") {

            const dashboardUrl = req.nextUrl.clone();

            if (role === "admin") {
                dashboardUrl.pathname = "/admin/dashboard";
            } else if (role === "finance") {
                dashboardUrl.pathname = "/finance/dashboard";
            } else {
                dashboardUrl.pathname = "/dashboard";
            }

            return NextResponse.redirect(dashboardUrl);
        }



        if (blockedWhenLoggedIn.includes(pathname)) {

            const dashboardUrl = req.nextUrl.clone();

            if (role === "admin") {
                dashboardUrl.pathname = "/admin/dashboard";
            } else if (role === "finance") {
                dashboardUrl.pathname = "/finance/dashboard";
            } else {
                dashboardUrl.pathname = "/dashboard";
            }

            return NextResponse.redirect(dashboardUrl);
        }

        return NextResponse.next();

    } catch (error) {

        const response = NextResponse.redirect(
            new URL("/auth/login", req.url)
        );

        response.cookies.delete("token");

        return response;
    }
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};