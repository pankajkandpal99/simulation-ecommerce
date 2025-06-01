import { z } from "zod";

export const cartItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  variant: z
    .object({
      name: z.string().optional(),
      value: z.string().optional(),
    })
    .optional(),
});

export const addToCartSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  variant: z
    .object({
      name: z.string().optional(),
      value: z.string().optional(),
    })
    .optional(),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().min(1, "Quantity must be at least 1"),
});

export type AddToCartSchema = z.infer<typeof addToCartSchema>;
export type UpdateCartItemSchema = z.infer<typeof updateCartItemSchema>;
export type CartItemSchema = z.infer<typeof cartItemSchema>;
