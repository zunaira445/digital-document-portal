import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const user = await prisma.user.findUnique({
      where: { id },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const newStatus = user.status === "ACTIVE" ? "BLOCKED" : "ACTIVE"

    await prisma.user.update({
      where: { id },
      data: { status: newStatus },
    })

    return NextResponse.json({ message: "Status updated", status: newStatus })
  } catch (error) {
    console.error("Toggle user error:", error)
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    )
  }
}