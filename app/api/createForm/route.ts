import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
  const { title, description, adminId, questions } = await req.json();
  if (!title) {
    return NextResponse.json({ message: "Title is required" }, { status: 400 });
  }
  try {
    const newForm = await prisma.form.create({
      data: {
        title,
        adminId,
        description,
        publicUrl: nanoid(10),
        questions: {
          create: questions.map((q) => ({
            type: q.type,
            label: q.label,
            options: q.options ? JSON.stringify(q.options) : null,
            order: q.order ?? 0,
          })),
        },
      },
    });

    return NextResponse.json(
      {
        message: "Form created successfully",
        form: {
          id: newForm.id,
          title: newForm.title,
          publicUrl: newForm.publicUrl,
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
