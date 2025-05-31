import { z } from "zod";

export const addressSchema = z
  .object({
    fullName: z.string().min(2, "Full name is required"),
    phoneNumber: z
      .string()
      .length(10, "Phone number must be 10 digits")
      .regex(/^[0-9]+$/, "Phone number must contain only digits"),
    addressLine1: z.string().min(5, "Address is required"),
    addressLine2: z.string().optional(),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    zipCode: z
      .string()
      .min(5, "ZIP code must be at least 5 digits")
      .regex(/^[0-9]{5,6}$/, "Invalid ZIP code format"),
    country: z.string().default("India"),
    type: z.enum(["home", "work", "other"]).default("home"),
    isDefault: z.boolean().default(false),
  })
  .strict();

export type AddressInput = z.infer<typeof addressSchema>;
