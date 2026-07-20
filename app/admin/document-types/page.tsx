import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function DocumentTypesPage() {
  const session = await auth()

  if (!session || session.user.role !== "ADMIN") {
    redirect("/")
  }

  const documentTypes = await prisma.documentType.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Document Types</h1>
        <Link href="/admin/dashboard" className="text-blue-600 hover:text-blue-800">
          ← Back to Dashboard
        </Link>
      </div>

      {/* Add New Form */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-lg font-semibold mb-4">Add New Document Type</h2>
        <form action="/api/admin/document-types" method="POST" className="flex gap-4">
          <input
            type="text"
            name="name"
            placeholder="Document name"
            required
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add
          </button>
        </form>
      </div>

      {/* Document Types List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {documentTypes.map((type) => (
              <tr key={type.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{type.name}</td>
                <td className="px-6 py-4">{type.description || "N/A"}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium
                    ${type.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                  `}>
                    {type.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <form action={`/api/admin/document-types/${type.id}/toggle`} method="POST">
                      <button
                        type="submit"
                        className={`text-xs px-2 py-1 rounded
                          ${type.isActive 
                            ? "bg-red-100 text-red-700 hover:bg-red-200" 
                            : "bg-green-100 text-green-700 hover:bg-green-200"
                          }
                        `}
                      >
                        {type.isActive ? "Deactivate" : "Activate"}
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