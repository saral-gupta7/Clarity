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
    .min(1, { message: "Title is required." })
    .max(255, { message: "Title must be under 255 characters." }),
  description: z
    .string()
    .max(1000, { message: "Description must be under 1000 characters." })
    .optional(),
  publicUrl: z.string().url({ message: "Please enter a valid URL." }),
  adminId: z.string().uuid({ message: "Admin ID must be a valid UUID." }),
});
