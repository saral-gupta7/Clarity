import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { adminId: string } }
) {
  try {
    const { adminId } = await params;
    const forms = await prisma.form.findMany({
      where: { adminId: adminId },
    });

    return NextResponse.json({
      message: "Forms fetched successfully",
      forms,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
