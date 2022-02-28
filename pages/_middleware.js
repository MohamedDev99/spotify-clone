import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
    // * Token will be exists if user is logged in
    const token = await getToken({ req, secret: process.env.JWT_SECRET });
    console.log(token);
    const { pathname } = req.nextUrl;

    // * Allow the requests if the followings is true
    // * 1) -  its a request for next-auth and provider fetching
    // * 2) - the token exists
    if (pathname.includes("/api/auth") || token) {
        return NextResponse.next();
    }

    // * Redirect them to login if they dont have token and are requesting a protected route
    if (!token && pathname !== "/login") {
        const url = req.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.rewrite(url);

        // return NextResponse.redirect("/login");
    }
}
