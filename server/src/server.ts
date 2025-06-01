import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { databaseConnection } from "./lib/db.js";
import { logger } from "./utils/logger.js";
import { Product } from "./models/product.model.js";
import { Category } from "./models/category.model.js";
import https from "https";
import mongoose from "mongoose";

const getOrCreateCategory = async (categoryName: string) => {
  const slug = categoryName.toLowerCase().replace(/\s+/g, "-");

  let category = await Category.findOne({ slug });

  if (!category) {
    category = new Category({
      name: categoryName,
      slug,
      description: `${categoryName} products`,
      isActive: true,
    });
    await category.save();
    logger.info(`✅ Created new category: ${categoryName}`);
  }

  return category._id;
};

const fetchAndStoreProducts = async (): Promise<void> => {
  try {
    const existingProducts = await Product.countDocuments();
    if (existingProducts > 0) {
      logger.info(
        `${existingProducts} products already exist. Skipping fetch.`
      );
      return;
    }

    logger.info("Fetching dummy products from API...");
    const url = "https://dummyjson.com/products?limit=200&skip=0";

    return new Promise((resolve, reject) => {
      https
        .get(url, async (res) => {
          let data = "";

          res.on("data", (chunk) => {
            data += chunk;
          });

          res.on("end", async () => {
            try {
              const parsedData = JSON.parse(data);
              const products = parsedData.products;

              logger.info(`✅ Fetched ${products.length} products from API`);

              // First process all unique categories
              const uniqueCategories = [
                ...new Set(products.map((p: any) => p.category)),
              ];
              const categoryMap = new Map<string, mongoose.Types.ObjectId>();

              for (const categoryName of uniqueCategories) {
                if (typeof categoryName === "string") {
                  const categoryId = await getOrCreateCategory(categoryName);
                  categoryMap.set(categoryName, categoryId);
                } else {
                  logger.warn(`Skipping non-string category: ${categoryName}`);
                }
              }

              // Then transform products with actual category IDs
              const transformedProducts = await Promise.all(
                products.map(async (product: any) => ({
                  title: product.title,
                  description: product.description,
                  price: product.price,
                  discountPercentage: product.discountPercentage,
                  rating: product.rating,
                  images: product.images,
                  category: categoryMap.get(product.category), // Use actual category ID
                  variants: [
                    {
                      name: "default",
                      value: "default",
                      price: product.price,
                      stock: product.stock,
                      sku: `SKU-${product.id}`,
                    },
                  ],
                  stock: product.stock,
                  sku: `SKU-${product.id}`,
                  isActive: true,
                  tags: [product.category, product.brand].filter(Boolean),
                  weight: product.weight || Math.floor(Math.random() * 100) + 1, // Default weight if not provided
                  dimensions: product.dimensions || {
                    length: Math.floor(Math.random() * 20) + 5,
                    width: Math.floor(Math.random() * 15) + 5,
                    height: Math.floor(Math.random() * 10) + 2,
                  },
                }))
              );

              const result = await Product.insertMany(transformedProducts);
              logger.info(
                `✅ Successfully inserted ${result.length} products with proper categories`
              );
              resolve();
            } catch (error) {
              logger.error("❌ Error processing products:", error);
              reject(error);
            }
          });
        })
        .on("error", (err) => {
          logger.error("❌ HTTP request failed:", err);
          reject(err);
        });
    });
  } catch (error) {
    logger.error("❌ Error in fetchAndStoreProducts:", error);
    throw error;
  }
};

const startServer = async () => {
  try {
    const app = await createApp();
    await databaseConnection.connect();

    // await fetchAndStoreProducts();

    const server = app.listen(env.PORT, () => {
      logger.info(`Server running on port ${env.PORT}`);
    });

    process.on("SIGTERM", () => {
      logger.info("Closing server...");
      server.close(async () => {
        await databaseConnection.disconnect();
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
