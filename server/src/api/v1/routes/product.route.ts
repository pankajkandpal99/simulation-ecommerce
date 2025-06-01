import { Router } from "express";
import { createApiHandler } from "../../../utils/api-factory.js";
import { ProductController } from "../controllers/product.controller.js";

export default (router: Router) => {
  router.get(
    "/products",
    createApiHandler(ProductController.getAllProducts, {
      useTransaction: true,
      requireAuth: false,
    })
  );
};
