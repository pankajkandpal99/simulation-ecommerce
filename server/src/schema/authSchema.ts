import { z } from "zod";

export const registerSchema = z
  .object({
    fullName: z.string().min(3, "Full name is required"),
    email: z.string().email("Invalid email address"),
    phoneNumber: z
      .string()
      .length(10, "Phone number must be 10 digits")
      .regex(/^[0-9]+$/, "Phone number must contain only digits"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  })
  .strict();

export const loginSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  })
  .strict();




export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
