import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"

export async function middleware(request) {
  const { pathname } = request.nextUrl

  // Public routes
  const publicPaths = ["/", "/login", "/register", "/forgot-password", "/admin/login", "/api/auth"]
  const isPublic = publicPaths.some((path) =>
    pathname === path || pathname.startsWith("/api/auth")
  )

  if (isPublic) {
    return NextResponse.next()
  }

  // Static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname.includes(".")
  ) {
    return NextResponse.next()
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // Redirect to login if not authenticated
  if (!token) {
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Admin routes require ADMIN role
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  // API routes require authentication
  if (pathname.startsWith("/api") && !pathname.startsWith("/api/auth")) {
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    // Admin API routes
    if (pathname.startsWith("/api/admin") && token.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/api/:path*",
  ],
}
