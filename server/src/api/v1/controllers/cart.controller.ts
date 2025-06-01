import { RequestContext } from "../../../middleware/context.js";
import { HttpResponse } from "../../../utils/service-response.js";
import { Cart } from "../../../models/cart.model.js";
import { Product } from "../../../models/product.model.js";
import {
  NotFoundError,
  ValidationError,
} from "../../../error-handler/index.js";
import { z } from "zod";

export const CartController = {
  getCart: async (context: RequestContext) => {
    try {
      const result = await context.withTransaction(async (session) => {
        const userId = context.user?.id;

        // Find or create cart for user
        let cart = await Cart.findOne({ user: userId })
          .populate({
            path: "items.product",
            model: "Product",
          })
          .session(session);

        if (!cart) {
          cart = new Cart({
            user: userId,
            items: [],
            subtotal: 0,
            tax: 0,
            shipping: 0,
            total: 0,
          });
          await cart.save({ session });
        }

        return cart;
      });

      return HttpResponse.send(context.res, result, 200);
    } catch (error) {
      throw error;
    }
  },

  addToCart: async (context: RequestContext) => {
    try {
      const result = await context.withTransaction(async (session) => {
        const { productId, quantity, variant } = context.req.body;
        const userId = context.user?.id;

        // Validate product exists
        const product = await Product.findById(productId).session(session);
        if (!product) {
          throw new NotFoundError("Product not found");
        }

        // Find or create cart
        let cart = await Cart.findOne({ user: userId }).session(session);
        if (!cart) {
          cart = new Cart({ user: userId, items: [] });
        }

        // Check if item already exists in cart
        const existingItemIndex = cart.items.findIndex(
          (item) =>
            item.product.toString() === productId &&
            (!variant ||
              (item.variant?.name === variant.name &&
                item.variant?.value === variant.value))
        );

        const price = variant?.price || product.price;

        if (existingItemIndex >= 0) {
          // Update quantity if item exists
          cart.items[existingItemIndex].quantity += quantity;
          cart.items[existingItemIndex].subtotal =
            cart.items[existingItemIndex].quantity * price;
        } else {
          // Add new item
          cart.items.push({
            product: productId,
            variant,
            quantity,
            price,
            subtotal: quantity * price,
          });
        }

        // Recalculate totals
        cart.subtotal = cart.items.reduce(
          (sum, item) => sum + item.subtotal,
          0
        );
        cart.total = cart.subtotal + cart.tax + cart.shipping;

        await cart.save({ session });

        return cart.populate({
          path: "items.product",
          model: "Product",
        });
      });

      return HttpResponse.send(context.res, result, 200);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError("Validation failed", error.errors);
      }
      throw error;
    }
  },

  updateCartItem: async (context: RequestContext) => {
    try {
      const result = await context.withTransaction(async (session) => {
        const { productId } = context.params;
        const { quantity } = context.req.body;
        const userId = context.user?.id;

        const cart = await Cart.findOne({ user: userId }).session(session);
        if (!cart) {
          throw new NotFoundError("Cart not found");
        }

        // Find item by productId
        const itemIndex = cart.items.findIndex(
          (item) => item.product.toString() === productId
        );

        if (itemIndex === -1) {
          throw new NotFoundError("Item not found in cart");
        }

        // Update quantity and subtotal
        cart.items[itemIndex].quantity = quantity;
        cart.items[itemIndex].subtotal = quantity * cart.items[itemIndex].price;

        // Recalculate totals
        cart.subtotal = cart.items.reduce(
          (sum, item) => sum + item.subtotal,
          0
        );
        cart.total = cart.subtotal + cart.tax + cart.shipping;

        await cart.save({ session });

        return cart.populate({
          path: "items.product",
          model: "Product",
        });
      });

      return HttpResponse.send(context.res, result, 200);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError("Validation failed", error.errors);
      }
      throw error;
    }
  },

  removeCartItem: async (context: RequestContext) => {
    try {
      const result = await context.withTransaction(async (session) => {
        const { productId } = context.params;
        const userId = context.user?.id;

        const cart = await Cart.findOne({ user: userId }).session(session);
        if (!cart) {
          throw new NotFoundError("Cart not found");
        }

        // Find item by productId
        const itemIndex = cart.items.findIndex(
          (item) => item.product.toString() === productId
        );

        if (itemIndex === -1) {
          throw new NotFoundError("Item not found in cart");
        }

        // Remove item
        cart.items.splice(itemIndex, 1);

        // Recalculate totals
        cart.subtotal = cart.items.reduce(
          (sum, item) => sum + item.subtotal,
          0
        );
        cart.total = cart.subtotal + cart.tax + cart.shipping;

        await cart.save({ session });

        return cart.populate({
          path: "items.product",
          model: "Product",
        });
      });

      return HttpResponse.send(context.res, result, 200);
    } catch (error) {
      throw error;
    }
  },

  clearCart: async (context: RequestContext) => {
    try {
      const result = await context.withTransaction(async (session) => {
        const userId = context.user?.id;

        const cart = await Cart.findOne({ user: userId }).session(session);
        if (!cart) {
          throw new NotFoundError("Cart not found");
        }

        // Clear all items
        cart.items = [];
        cart.subtotal = 0;
        cart.total = 0;

        await cart.save({ session });

        return cart;
      });

      return HttpResponse.send(context.res, result, 200);
    } catch (error) {
      throw error;
    }
  },
};
