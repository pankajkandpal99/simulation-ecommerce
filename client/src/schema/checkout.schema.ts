import { z } from "zod";

export const checkoutFormSchema = z
  .object({
    fullName: z.string().min(2, "Full name is required"),
    email: z.string().email("Invalid email format"),
    phoneNumber: z
      .string()
      .length(10, "Phone number must be 10 digits")
      .regex(/^[0-9]+$/, "Phone number must contain only digits"),
    address: z.string().min(5, "Address is required"),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    zipCode: z
      .string()
      .min(5, "ZIP code must be at least 5 digits")
      .regex(/^[0-9]{5,6}$/, "Invalid ZIP code format"),
    cardNumber: z
      .string()
      .length(16, "Card number must be 16 digits")
      .regex(/^[0-9]+$/, "Card number must contain only digits"),
    expiryDate: z
      .string()
      .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Expiry date must be in MM/YY format")
      .refine((date) => {
        const [month, year] = date.split("/");
        const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
        return expiry > new Date();
      }, "Card has expired"),
    cvv: z
      .string()
      .length(3, "CVV must be 3 digits")
      .regex(/^[0-9]+$/, "CVV must contain only digits"),
    transactionType: z.enum(["1", "2", "3"]), // For transaction simulation
  })
  .strict();

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;
