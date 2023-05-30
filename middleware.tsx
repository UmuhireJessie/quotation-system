import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const config = {
    matcher: ['/audit', '/client-report', '/clients', '/payment-report', '/payment', '/quote-report', '/quote', '/sms-report', '/sms', '/users', '/dashboard/:path*'],
};

export function middleware(req: NextRequest) {

    const token = req.cookies.get('token')?.value;
    const pathUrl = req.nextUrl
    const url = req


    if (token === undefined) {
        return NextResponse.redirect(`${pathUrl.origin}/?toast=Please sign in first.`)
    } else {
        try {
            // decode the JWT token
            const decodedToken = jwt.decode(token);

            // check if the JWT is expired
            const currentTime = Date.now() / 1000;
            if (decodedToken.expires < currentTime) {
                req.cookies.delete('token');
                return NextResponse.redirect(`${pathUrl.origin}/?toast=You've been signed out! Sign in again`)
            }
            if (pathUrl.href === `${pathUrl.origin}/`) {
                return NextResponse.redirect(`${pathUrl.origin}/dashboard`);
            }
            if (decodedToken.role !== 'admin' && pathUrl.href === `${pathUrl.origin}/users`) {
                return NextResponse.redirect(`${pathUrl.origin}/dashboard?toast=You're not authorized to access staff page.`)
            }

            return NextResponse.next()

        } catch (error) {
            return NextResponse.redirect(`${pathUrl.origin}/?toast=Please sign in first.`)
        }
    }
}