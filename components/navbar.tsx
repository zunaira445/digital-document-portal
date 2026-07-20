"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"

export default function Navbar() {
  const { data: session } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push("/login")
    router.refresh()
  }

  // Admin pages pe navbar mat dikhao
  if (pathname.startsWith("/admin")) {
    return null
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-blue-600">
              Digital Document Portal
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <Link href="/dashboard" className="text-gray-700 hover:text-blue-600">
                  Dashboard
                </Link>
                <Link href="/requests" className="text-gray-700 hover:text-blue-600">
                  My Requests
                </Link>
                <Link href="/notifications" className="text-gray-700 hover:text-blue-600">
                  Notifications
                </Link>
                <Link href="/profile" className="text-gray-700 hover:text-blue-600">
                  Profile
                </Link>
                
                {session.user?.role === "ADMIN" && (
                  <Link href="/admin/dashboard" className="text-purple-600 font-bold bg-purple-100 px-3 py-1 rounded">
                    Admin Panel
                  </Link>
                )}
                
                <span className="text-gray-500 text-sm">
                  {session.user?.name || session.user?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 hover:text-blue-600">
                  Login
                </Link>
                <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}