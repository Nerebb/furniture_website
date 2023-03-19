// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'


// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const token = await getToken({
        req: request,
        secret: process.env.SECRET
    },)

    //Get clientUrl
    const { pathname } = request.nextUrl

    //Check if (token exist) | request to nextAuth for session && others userProfile | production: request to '/_next'
    if (token || pathname.includes('/api/auth') || pathname.includes('/_next')) {
        // Force user not to login again
        if (pathname === '/login') {
            return NextResponse.redirect(new URL('/', request.url))
        }

        //Passing condition
        return NextResponse.next()
    }

    //Redirect if user not login : Invalid token
    if (!token && pathname !== '/login') {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/login', '/account/:path*', '/api/user/[id]']
}