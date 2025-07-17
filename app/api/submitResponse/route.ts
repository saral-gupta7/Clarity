import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
  const { answers, formId } = await req.json();
  if (!formId || !Array.isArray(answers) || answers.length === 0) {
    return NextResponse.json(
      { message: "formId and answers array are required." },
      { status: 400 }
    );
  }

  try {
    const form = await prisma.form.findUnique({
      where: { id: formId },
      select: { id: true },
    });

    if (!form) {
      return NextResponse.json({ message: "Form not found." }, { status: 404 });
    }
    const questionIds = answers.map((a) => a.questionId);
    const validQuestions = await prisma.question.findMany({
      where: { formId, id: { in: questionIds } },
      select: { id: true },
    });
    if (validQuestions.length !== answers.length) {
      return NextResponse.json(
        { message: "One or more question IDs are invalid for this form." },
        { status: 400 }
      );
    }
    const newResponse = await prisma.response.create({
      data: {
        formId,
        answers: {
          create: answers.map((a) => ({
            questionId: a.questionId,
            value: a.value,
          })),
        },
      },
    });
    return NextResponse.json(
      {
        message: "Answers Submitted Successfully",
        responseId: newResponse.id,
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
