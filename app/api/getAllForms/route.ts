import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const forms = await prisma.form.findMany();

    if (forms.length === 0) {
      return NextResponse.json(
        { message: "No forms found", forms: [] },
        { status: 200 }
      );
    }

    return NextResponse.json({
      message: "Formed fetched successfully",
      forms: forms,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
