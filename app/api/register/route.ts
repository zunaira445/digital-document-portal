import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      )
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: password + "_hashed",
        role: "USER",
        status: "ACTIVE",
      },
    })

    return NextResponse.json(
      { message: "User created", user: { id: user.id, email: user.email } },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}