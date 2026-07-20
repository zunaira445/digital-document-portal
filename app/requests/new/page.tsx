import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import NewRequestForm from "@/components/new-request-form"

export default async function NewRequestPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const documentTypes = await prisma.documentType.findMany({
    where: { isActive: true },
  })

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">New Document Request</h1>
      <NewRequestForm documentTypes={documentTypes} />
    </div>
  )
}