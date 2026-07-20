import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const totalRequests = await prisma.documentRequest.count({
    where: { userId: session.user.id },
  })

  const pendingRequests = await prisma.documentRequest.count({
    where: { userId: session.user.id, status: "PENDING" },
  })

  const approvedRequests = await prisma.documentRequest.count({
    where: { userId: session.user.id, status: "APPROVED" },
  })

  const rejectedRequests = await prisma.documentRequest.count({
    where: { userId: session.user.id, status: "REJECTED" },
  })

  const recentRequests = await prisma.documentRequest.findMany({
    where: { userId: session.user.id },
    include: { documentType: true },
    orderBy: { createdAt: "desc" },
    take: 5,
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Welcome, {session.user.name || session.user.email}
      </h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600">Total Requests</p>
          <p className="text-3xl font-bold text-blue-600">{totalRequests}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-3xl font-bold text-yellow-600">{pendingRequests}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600">Approved</p>
          <p className="text-3xl font-bold text-green-600">{approvedRequests}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600">Rejected</p>
          <p className="text-3xl font-bold text-red-600">{rejectedRequests}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex gap-4">
          <Link href="/requests/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            New Request
          </Link>
          <Link href="/requests" className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">
            View All Requests
          </Link>
        </div>
      </div>

      {/* Recent Requests */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Recent Activity</h2>
        </div>
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Document</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Purpose</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {recentRequests.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  No requests yet. Create your first request!
                </td>
              </tr>
            ) : (
              recentRequests.map((request) => (
                <tr key={request.id}>
                  <td className="px-6 py-4">{request.documentType.name}</td>
                  <td className="px-6 py-4">{request.purpose}</td>
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}