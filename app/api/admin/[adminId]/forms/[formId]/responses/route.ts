import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(context: {
  params: { adminId: string; formId: string };
}) {
  const { adminId, formId } = context.params;

  try {
    const form = await prisma.form.findFirst({
      where: {
        id: formId,
        adminId: adminId,
      },
      include: {
        questions: true,
        responses: {
          include: {
            answers: {
              include: {
                question: true,
              },
            },
          },
        },
      },
    });

    if (!form) {
      return NextResponse.json({ message: "Form not found." }, { status: 404 });
    }

    return NextResponse.json({
      message: "Form fetched successfully",
      form,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
