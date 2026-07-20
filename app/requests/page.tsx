import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function RequestsPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const requests = await prisma.documentRequest.findMany({
    where: { userId: session.user.id },
    include: { documentType: true },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between mb-8">
        <h1 className="text-3xl font-bold">My Requests</h1>
        <Link href="/requests/new" className="bg-blue-600 text-white px-4 py-2 rounded">
          New Request
        </Link>
      </div>

      <div className="bg-white rounded shadow">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Document</th>
              <th className="px-6 py-3 text-left">Purpose</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id}>
                <td className="px-6 py-4">{req.documentType.name}</td>
                <td className="px-6 py-4">{req.purpose}</td>
                <td className="px-6 py-4">{req.status}</td>
                <td className="px-6 py-4">{new Date(req.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}