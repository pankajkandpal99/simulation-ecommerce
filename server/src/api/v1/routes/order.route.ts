import { Router } from "express";
import { createApiHandler } from "../../../utils/api-factory.js";
import { OrderController } from "../controllers/order.controller.js";
import {
  createOrderSchema,
  updateOrderStatusSchema,
} from "../../../schema/order.schema.js";

export default (router: Router) => {
  router.post(
    "/orders",
    createApiHandler(OrderController.createOrder, {
      bodySchema: createOrderSchema,
      useTransaction: true,
      requireAuth: true,
    })
  );

  router.get(
    "/orders",
    createApiHandler(OrderController.getOrders, {
      useTransaction: true,
      requireAuth: true,
    })
  );

  router.get(
    "/orders/:orderId",
    createApiHandler(OrderController.getOrderById, {
      useTransaction: true,
      requireAuth: true,
    })
  );

  router.put(
    "/orders/:orderId/status",
    createApiHandler(OrderController.updateOrderStatus, {
      bodySchema: updateOrderStatusSchema,
      useTransaction: true,
      requireAuth: true,
    })
  );

  router.put(
    "/orders/:orderId/cancel",
    createApiHandler(OrderController.cancelOrder, {
      useTransaction: true,
      requireAuth: true,
    })
  );
};
