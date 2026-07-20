import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session || session.user.role !== "ADMIN") {
    redirect("/")
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar - Only Admin Links */}
      <aside className="w-64 bg-gray-800 text-white flex-shrink-0">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold">Admin Panel</h2>
          <p className="text-xs text-gray-400 mt-1">{session.user.email}</p>
        </div>
        <nav className="mt-4">
          <Link href="/admin/dashboard" className="block px-4 py-3 hover:bg-gray-700 transition">
            📊 Dashboard
          </Link>
          <Link href="/admin/users" className="block px-4 py-3 hover:bg-gray-700 transition">
            👥 Manage Users
          </Link>
          <Link href="/admin/requests" className="block px-4 py-3 hover:bg-gray-700 transition">
            📋 Manage Requests
          </Link>
          <Link href="/admin/document-types" className="block px-4 py-3 hover:bg-gray-700 transition">
            📄 Document Types
          </Link>
          <div className="border-t border-gray-700 mt-4 pt-4">
            <Link href="/" className="block px-4 py-3 text-blue-300 hover:bg-gray-700 transition">
              🏠 Back to Website
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 overflow-auto">
        {children}
      </main>
    </div>
  )
}