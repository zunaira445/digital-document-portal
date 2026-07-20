import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"

export default async function ProfilePage() {
  const session = await auth()
  if (!session) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  const requestStats = await prisma.documentRequest.groupBy({
    by: ['status'],
    where: { userId: session.user.id },
    _count: { status: true },
  })

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="md:col-span-2 bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-6">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
            </div>
            <div className="ml-4">
              <h2 className="text-2xl font-bold text-gray-900">{user?.name || "No Name"}</h2>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex border-b pb-3">
              <span className="w-32 text-gray-500">Full Name</span>
              <span className="font-medium">{user?.name || "Not set"}</span>
            </div>
            <div className="flex border-b pb-3">
              <span className="w-32 text-gray-500">Email</span>
              <span className="font-medium">{user?.email}</span>
            </div>
            <div className="flex border-b pb-3">
              <span className="w-32 text-gray-500">Phone</span>
              <span className="font-medium">{user?.phone || "Not set"}</span>
            </div>
            <div className="flex border-b pb-3">
              <span className="w-32 text-gray-500">Address</span>
              <span className="font-medium">{user?.address || "Not set"}</span>
            </div>
            <div className="flex border-b pb-3">
              <span className="w-32 text-gray-500">Role</span>
              <span className={`px-2 py-1 rounded text-xs font-medium
                ${user?.role === "ADMIN" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"}
              `}>
                {user?.role}
              </span>
            </div>
            <div className="flex border-b pb-3">
              <span className="w-32 text-gray-500">Status</span>
              <span className={`px-2 py-1 rounded text-xs font-medium
                ${user?.status === "ACTIVE" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
              `}>
                {user?.status}
              </span>
            </div>
            <div className="flex">
              <span className="w-32 text-gray-500">Member Since</span>
              <span className="font-medium">{new Date(user?.createdAt || "").toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Request Statistics</h3>
          <div className="space-y-4">
            {requestStats.map((stat) => (
              <div key={stat.status} className="flex justify-between items-center">
                <span className="text-gray-600">{stat.status}</span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">
                  {stat._count.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}