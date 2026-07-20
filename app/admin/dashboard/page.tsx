import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function AdminDashboardPage() {
  const session = await auth()

  if (!session || session.user.role !== "ADMIN") {
    redirect("/")
  }

  const totalUsers = await prisma.user.count()
  const totalRequests = await prisma.documentRequest.count()
  const pendingRequests = await prisma.documentRequest.count({ where: { status: "PENDING" } })
  const approvedRequests = await prisma.documentRequest.count({ where: { status: "APPROVED" } })
  const rejectedRequests = await prisma.documentRequest.count({ where: { status: "REJECTED" } })

  const recentRequests = await prisma.documentRequest.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { user: true, documentType: true },
  })

  const recentUsers = await prisma.user.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
          <p className="text-sm opacity-90">Total Users</p>
          <p className="text-4xl font-bold mt-2">{totalUsers}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
          <p className="text-sm opacity-90">Total Requests</p>
          <p className="text-4xl font-bold mt-2">{totalRequests}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 text-white p-6 rounded-xl shadow-lg">
          <p className="text-sm opacity-90">Pending</p>
          <p className="text-4xl font-bold mt-2">{pendingRequests}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
          <p className="text-sm opacity-90">Approved</p>
          <p className="text-4xl font-bold mt-2">{approvedRequests}</p>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-xl shadow-lg">
          <p className="text-sm opacity-90">Rejected</p>
          <p className="text-4xl font-bold mt-2">{rejectedRequests}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Quick Actions</h2>
        <div className="flex gap-4">
          <Link href="/admin/users" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium transition shadow-md">
            👥 Manage Users
          </Link>
          <Link href="/admin/requests" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium transition shadow-md">
            📋 Manage Requests
          </Link>
          <Link href="/admin/document-types" className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 font-medium transition shadow-md">
            📄 Document Types
          </Link>
        </div>
      </div>

      {/* Recent Requests */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-800">📋 Recent Requests</h2>
        </div>
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Document</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {recentRequests.map((request) => (
              <tr key={request.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{request.user.name || request.user.email}</td>
                <td className="px-6 py-4">{request.documentType.name}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium
                    ${request.status === "PENDING" ? "bg-yellow-100 text-yellow-800" : ""}
                    ${request.status === "APPROVED" ? "bg-green-100 text-green-800" : ""}
                    ${request.status === "REJECTED" ? "bg-red-100 text-red-800" : ""}
                    ${request.status === "UNDER_REVIEW" ? "bg-blue-100 text-blue-800" : ""}
                  `}>
                    {request.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  {new Date(request.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recent Users */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-800">👥 Recent Users</h2>
        </div>
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {recentUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{user.name || "N/A"}</td>
                <td className="px-6 py-4">{user.email}</td>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}