import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function ManageRequestsPage() {
  const session = await auth()

  if (!session || session.user.role !== "ADMIN") {
    redirect("/")
  }

  const requests = await prisma.documentRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true, documentType: true },
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Requests</h1>
        <Link href="/admin/dashboard" className="text-blue-600 hover:text-blue-800">
          ← Back to Dashboard
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Document</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Purpose</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Urgency</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {requests.map((request) => (
              <tr key={request.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm">{request.id.slice(0, 8)}...</td>
                <td className="px-6 py-4">{request.user.name || request.user.email}</td>
                <td className="px-6 py-4">{request.documentType.name}</td>
                <td className="px-6 py-4">{request.purpose}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium
                    ${request.status === "PENDING" ? "bg-yellow-100 text-yellow-800" : ""}
                    ${request.status === "APPROVED" ? "bg-green-100 text-green-800" : ""}
                    ${request.status === "REJECTED" ? "bg-red-100 text-red-800" : ""}
                    ${request.status === "UNDER_REVIEW" ? "bg-blue-100 text-blue-800" : ""}
                    ${request.status === "NEED_MORE_INFO" ? "bg-orange-100 text-orange-800" : ""}
                    ${request.status === "COMPLETED" ? "bg-purple-100 text-purple-800" : ""}
                  `}>
                    {request.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-medium
                    ${request.urgency === "URGENT" ? "text-red-600" : ""}
                    ${request.urgency === "HIGH" ? "text-orange-600" : ""}
                    ${request.urgency === "NORMAL" ? "text-blue-600" : ""}
                    ${request.urgency === "LOW" ? "text-green-600" : ""}
                  `}>
                    {request.urgency}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  {new Date(request.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-1 flex-wrap">
                    <form action={`/api/admin/requests/${request.id}/status`} method="POST">
                      <input type="hidden" name="status" value="APPROVED" />
                      <button type="submit" className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200">
                        Approve
                      </button>
                    </form>
                    <form action={`/api/admin/requests/${request.id}/status`} method="POST">
                      <input type="hidden" name="status" value="REJECTED" />
                      <button type="submit" className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200">
                        Reject
                      </button>
                    </form>
                    <form action={`/api/admin/requests/${request.id}/status`} method="POST">
                      <input type="hidden" name="status" value="UNDER_REVIEW" />
                      <button type="submit" className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200">
                        Review
                      </button>
                    </form>
                    <form action={`/api/admin/requests/${request.id}/status`} method="POST">
                      <input type="hidden" name="status" value="COMPLETED" />
                      <button type="submit" className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200">
                        Complete
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