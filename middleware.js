import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"

export async function middleware(request) {
  const { pathname } = request.nextUrl

  const publicPages = ["/", "/login", "/register", "/forgot-password", "/admin/login"]
  const publicApiPrefixes = [
    "/api/auth",
    "/api/register",
    "/api/sms",
    "/api/machines/purchase",
    "/api/machines/dispense-callback",
  ]

  const isPublicPage = publicPages.some((path) => pathname === path)
  const isPublicApi = publicApiPrefixes.some((prefix) => pathname.startsWith(prefix))

  if (isPublicPage || isPublicApi) {
    return NextResponse.next()
  }

  if (pathname.startsWith("/_next") || pathname.startsWith("/images") || pathname.includes(".")) {
    return NextResponse.next()
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if (pathname.startsWith("/api")) {
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (pathname.startsWith("/api/admin") && token.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    return NextResponse.next()
  }

  if (!token) {
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (pathname.startsWith("/admin") && pathname !== "/admin/login" && token.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/api/:path*"],
}
