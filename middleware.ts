import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const userRole = req.auth?.user?.role

  const isAuthRoute = nextUrl.pathname.startsWith("/login") || 
                      nextUrl.pathname.startsWith("/register")
  const isAdminRoute = nextUrl.pathname.startsWith("/admin")
  const isDashboardRoute = nextUrl.pathname.startsWith("/dashboard") ||
                           nextUrl.pathname.startsWith("/profile") ||
                           nextUrl.pathname.startsWith("/requests")

  // Redirect logged in users from auth pages
  if (isAuthRoute && isLoggedIn) {
    if (userRole === "ADMIN") {
      return NextResponse.redirect(new URL("/admin/dashboard", nextUrl))
    }
    return NextResponse.redirect(new URL("/dashboard", nextUrl))
  }

  // Protect dashboard routes
  if (isDashboardRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl))
  }

  // Protect admin routes
  if (isAdminRoute && (!isLoggedIn || userRole !== "ADMIN")) {
    return NextResponse.redirect(new URL("/", nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
}