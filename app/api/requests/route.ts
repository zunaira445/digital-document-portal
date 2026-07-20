import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"

export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { documentTypeId, purpose, description, urgency } = await request.json()

    if (!documentTypeId || !purpose) {
      return NextResponse.json(
        { error: "Document type and purpose are required" },
        { status: 400 }
      )
    }

    const newRequest = await prisma.documentRequest.create({
      data: {
        userId: session.user.id,
        documentTypeId,
        purpose,
        description,
        urgency: urgency || "NORMAL",
        status: "PENDING",
      },
    })

    return NextResponse.json(newRequest, { status: 201 })
  } catch (error) {
    console.error("Create request error:", error)
    return NextResponse.json(
      { error: "Failed to create request" },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    // Proper typed where clause
    const where: Prisma.DocumentRequestWhereInput = {
      userId: session.user.id,
    }

    if (status) {
      where.status = status as Prisma.EnumRequestStatusFilter<"DocumentRequest">
    }

    const requests = await prisma.documentRequest.findMany({
      where,
      include: { documentType: true },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(requests)
  } catch (error) {
    console.error("Fetch requests error:", error)
    return NextResponse.json(
      { error: "Failed to fetch requests" },
      { status: 500 }
    )
  }
}