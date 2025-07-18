import { z } from "zod";

export const registerAdminSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(50, { message: "Name must be under 50 characters." }),

  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .max(100, { message: "Password must be under 100 characters." })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[@$!%*?&]/, {
      message: "Password must contain at least one special character.",
    }),
});

export const formSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Title is required." })
    .max(255, { message: "Title must be under 255 characters." }),

  description: z
    .string()
    .max(1000, { message: "Description must be under 1000 characters." })
    .optional(),

  questions: z
    .array(
      z.object({
        type: z.string().min(1, { message: "Question type is required." }),

        label: z
          .string()
          .min(1, { message: "Question label is required." })
          .max(500, {
            message: "Question label must be under 500 characters.",
          }),

        options: z
          .array(
            z.object({
              value: z
                .string()
                .min(1, { message: "Option value cannot be empty." }),
            })
          )
          .optional(),

        order: z.number().optional(),
      })
    )
    .min(1, { message: "At least one question is required." })
    .refine(
      (questions) =>
        questions.every(
          (q) =>
            q.type !== "multiple_choice" ||
            (q.options?.filter((opt) => opt.value?.trim() !== "").length ??
              0) >= 2
        ),
      {
        message: "Multiple choice questions must have at least 2 options.",
        path: ["questions"],
      }
    ),
});
