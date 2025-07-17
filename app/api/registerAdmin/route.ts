import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { registerAdminSchema } from "@/lib/schema";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const res = registerAdminSchema.safeParse(body);

  if (!res.success) {
    return NextResponse.json(
      {
        message: "Validation failed",
        errors: res.error,
      },
      { status: 400 }
    );
  }
  const { email, password, name } = res.data;
  try {
    const existingAdmin = await prisma.admin.findUnique({
      where: { email },
    });
    if (existingAdmin) {
      return NextResponse.json(
        {
          message: "Account with this email already exists",
        },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newAdmin = await prisma.admin.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      {
        message: "You have registered successfully!",
        admin: {
          id: newAdmin.id,
          email: newAdmin.email,
          name: newAdmin.name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
