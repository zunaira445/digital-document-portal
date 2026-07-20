import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function ManageUsersPage() {
  const session = await auth()

  if (!session || session.user.role !== "ADMIN") {
    redirect("/")
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
        <Link href="/admin/dashboard" className="text-blue-600 hover:text-blue-800">
          ← Back to Dashboard
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{user.name || "N/A"}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.phone || "N/A"}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium
                    ${user.role === "ADMIN" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"}
                  `}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium
                    ${user.status === "ACTIVE" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                  `}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <form action={`/api/admin/users/${user.id}/toggle`} method="POST">
                      <button
                        type="submit"
                        className={`text-xs px-2 py-1 rounded
                          ${user.status === "ACTIVE" 
                            ? "bg-red-100 text-red-700 hover:bg-red-200" 
                            : "bg-green-100 text-green-700 hover:bg-green-200"
                          }
                        `}
                      >
                        {user.status === "ACTIVE" ? "Block" : "Unblock"}
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}