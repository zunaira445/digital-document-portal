import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const docType = await prisma.documentType.findUnique({
      where: { id },
    })

    if (!docType) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    await prisma.documentType.update({
      where: { id },
      data: {
        isActive: !docType.isActive,
      },
    })

    return NextResponse.json({ message: "Status updated" })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to update" },
      { status: 500 }
    )
  }
}