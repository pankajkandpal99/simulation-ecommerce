import { Product } from "../../../models/product.model.js";
import { RequestContext } from "../../../middleware/context.js";
import { HttpResponse } from "../../../utils/service-response.js";

export const ProductController = {
  getAllProducts: async (context: RequestContext) => {
    try {
      const result = await context.withTransaction(async (session) => {
        const { page = 1, limit = 10 } = context.req.query;
        const skip = (Number(page) - 1) * Number(limit);

        const products = await Product.find({ isActive: true })
          .session(session)
          .skip(skip)
          .limit(Number(limit))
          .populate("category", "name slug")
          .lean();

        const total = await Product.countDocuments({ isActive: true }).session(
          session
        );

        return {
          products,
          total,
          page: Number(page),
          pages: Math.ceil(total / Number(limit)),
        };
      });

      return HttpResponse.send(context.res, result, 200);
    } catch (error) {
      throw error;
    }
  },
};
