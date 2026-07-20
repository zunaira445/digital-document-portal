import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const name = formData.get("name") as string
    const description = formData.get("description") as string

    if (!name) {
      return NextResponse.json({ error: "Name required" }, { status: 400 })
    }

    await prisma.documentType.create({
      data: {
        name,
        description: description || null,
      },
    })

    return NextResponse.json({ message: "Document type created" })
  } catch (error) {
    console.error("Create document type error:", error)
    return NextResponse.json(
      { error: "Failed to create" },
      { status: 500 }
    )
  }
}