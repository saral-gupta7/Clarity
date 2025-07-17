import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { publicUrl: string } }
) {
  const form = await prisma.form.findUnique({
    where: { publicUrl: params.publicUrl },
    include: { questions: true },
  });

  if (!form) {
    return NextResponse.json({ message: "Form not found." }, { status: 404 });
  }

  return NextResponse.json({ form });
}
