import { Router } from "express";
import { createApiHandler } from "../../../utils/api-factory.js";
import { CartController } from "../controllers/cart.controller.js";
import { addToCartSchema, updateCartItemSchema } from "@/schema/cart.schema.js";

export default (router: Router) => {
  router.get(
    "/cart",
    createApiHandler(CartController.getCart, {
      useTransaction: true,
      requireAuth: true,
    })
  );

  router.post(
    "/cart/add",
    createApiHandler(CartController.addToCart, {
      bodySchema: addToCartSchema,
      useTransaction: true,
      requireAuth: true,
    })
  );

  router.put(
    "/cart/update/:productId",
    createApiHandler(CartController.updateCartItem, {
      bodySchema: updateCartItemSchema,
      useTransaction: true,
      requireAuth: true,
    })
  );

  router.delete(
    "/cart/remove/:productId",
    createApiHandler(CartController.removeCartItem, {
      useTransaction: true,
      requireAuth: true,
    })
  );

  router.delete(
    "/cart/clear",
    createApiHandler(CartController.clearCart, {
      useTransaction: true,
      requireAuth: true,
    })
  );
};
