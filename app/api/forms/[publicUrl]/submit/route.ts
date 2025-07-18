import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { publicUrl: string } }
) {
  try {
    const { answers, name } = await req.json();

    const { publicUrl } = await params;
    if (!publicUrl || !answers || !Array.isArray(answers) || !name) {
      return NextResponse.json(
        { message: "Invalid request data. Name and answers are required." },
        { status: 400 }
      );
    }

    const form = await prisma.form.findUnique({
      where: { publicUrl },
      include: { questions: true },
    });

    if (!form) {
      return NextResponse.json({ message: "Form not found." }, { status: 404 });
    }

    const validQuestionIds = form.questions.map((q) => q.id);
    const isValid = answers.every((a) =>
      validQuestionIds.includes(a.questionId)
    );

    if (!isValid) {
      return NextResponse.json(
        { message: "Invalid question IDs." },
        { status: 400 }
      );
    }

    const response = await prisma.response.create({
      data: {
        formId: form.id,
        name,
        answers: {
          create: answers.map((a) => ({
            questionId: a.questionId,
            value: a.value,
          })),
        },
      },
    });

    return NextResponse.json(
      { message: "Response submitted.", responseId: response.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting response:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
