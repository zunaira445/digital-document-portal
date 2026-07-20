import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { RequestStatus } from "@prisma/client"

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

    const formData = await request.formData()
    const status = formData.get("status") as string

    if (!status) {
      return NextResponse.json({ error: "Status required" }, { status: 400 })
    }

    const validStatuses: RequestStatus[] = ["PENDING", "UNDER_REVIEW", "NEED_MORE_INFO", "APPROVED", "REJECTED", "COMPLETED"]
    
    if (!validStatuses.includes(status as RequestStatus)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const requestStatus = status as RequestStatus

    await prisma.documentRequest.update({
      where: { id },
      data: { status: requestStatus },
    })

    await prisma.requestStatusHistory.create({
      data: {
        requestId: id,
        status: requestStatus,
        comment: `Status changed to ${status} by admin`,
        createdBy: session.user.id,
      },
    })

    const docRequest = await prisma.documentRequest.findUnique({
      where: { id },
      include: { user: true, documentType: true },
    })

    if (docRequest) {
      await prisma.notification.create({
        data: {
          userId: docRequest.userId,
          requestId: id,
          title: "Request Update",
          message: `Your ${docRequest.documentType.name} request has been ${status.toLowerCase()}.`,
        },
      })
    }

    return NextResponse.json({ message: "Status updated" })
  } catch (error) {
    console.error("Update status error:", error)
    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 }
    )
  }
}