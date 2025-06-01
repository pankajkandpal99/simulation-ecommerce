import { z } from "zod";

const addressSchema = z.object({
  street: z.string().min(10, "Address must be at least 10 characters"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z
    .string()
    .min(5, "Zip code must be 5 digits")
    .max(6, "Zip code must be 5-6 digits"),
});

const customerSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z
    .string()
    .length(10, "Phone number must be 10 digits")
    .regex(/^[0-9]+$/, "Phone number must contain only digits"),
  address: addressSchema,
});

const paymentSchema = z.object({
  cardNumber: z
    .string()
    .length(16, "Card number must be 16 digits")
    .regex(/^[0-9]+$/, "Card number must contain only digits"),
  expiryDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, "Invalid expiry date (MM/YY)"),
  cvv: z
    .string()
    .length(3, "CVV must be 3 digits")
    .regex(/^[0-9]+$/, "CVV must contain only digits"),
});

const orderItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  variant: z
    .object({
      name: z.string(),
      value: z.string(),
    })
    .optional(),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  price: z.number().min(0, "Price must be positive"),
});

export const createOrderSchema = z.object({
  customer: customerSchema,
  payment: paymentSchema,
  items: z.array(orderItemSchema).min(1, "At least one item is required"),
  subtotal: z.number().min(0, "Subtotal must be positive"),
  shipping: z.number().min(0, "Shipping must be positive"),
  tax: z.number().min(0, "Tax must be positive"),
  total: z.number().min(0, "Total must be positive"),
  transactionType: z.enum(["1", "2", "3"]),
});

export const updateOrderStatusSchema = z.object({
  orderStatus: z.string().optional(),
  paymentStatus: z.string().optional(),
  trackingNumber: z.string().optional(),
  notes: z.string().optional(),
});

export type CreateOrderValues = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusValues = z.infer<typeof updateOrderStatusSchema>;
