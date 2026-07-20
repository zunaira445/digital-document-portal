import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"

export default async function NotificationsPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Notifications</h1>
      {notifications.map((n) => (
        <div key={n.id} className="bg-white p-4 rounded shadow mb-4">
          <h3 className="font-bold">{n.title}</h3>
          <p>{n.message}</p>
          <p className="text-sm text-gray-500">{new Date(n.createdAt).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  )
}