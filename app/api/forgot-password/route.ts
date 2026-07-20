import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Simple reset - show message (no real email in dev)
    return NextResponse.json({
      message: "Password reset link sent! (Check console for demo)",
      demoLink: `http://localhost:3000/reset-password?email=${email}&token=demo123`,
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}