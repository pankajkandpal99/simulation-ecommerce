// import { Product } from "@/models/product.model.js";
// import dotenv from "dotenv";
// import https from "https";
// import mongoose from "mongoose";

// dotenv.config();

// mongoose
//   .connect(process.env.MONGODB_URI!)
//   .then(() => console.log("✅ Connected to MongoDB"))
//   .catch((err) => console.error("❌ MongoDB connection error:", err));

// const fetchProducts = async (): Promise<void> => {
//   const url = "https://dummyjson.com/products";

//   https
//     .get(url, async (res) => {
//       let data = "";

//       res.on("data", (chunk) => {
//         data += chunk;
//       });

//       res.on("end", async () => {
//         try {
//           const parsedData = JSON.parse(data);
//           const products = parsedData.products;

//           console.log(`✅ Fetched ${products.length} products`);

//           const transformedProducts = products.map((product: any) => ({
//             title: product.title,
//             description: product.description,
//             price: product.price,
//             images: product.images,
//             category: new mongoose.Types.ObjectId(),
//             variants: [
//               {
//                 name: "default",
//                 value: "default",
//                 price: product.price,
//                 stock: product.stock,
//                 sku: `SKU-${product.id}`,
//               },
//             ],
//             stock: product.stock,
//             sku: `SKU-${product.id}`,
//             isActive: true,
//             tags: [product.category, product.brand].filter(Boolean),
//             weight: product.weight || undefined,
//             dimensions: product.dimensions || undefined,
//           }));

//           const result = await Product.insertMany(transformedProducts);
//           console.log(`✅ Successfully inserted ${result.length} products`);
//           await mongoose.disconnect();
//           process.exit(0);
//         } catch (error) {
//           console.error("❌ Error:", error);
//           await mongoose.disconnect();
//           process.exit(1);
//         }
//       });
//     })
//     .on("error", (err) => {
//       console.error("❌ HTTP request failed:", err.message);
//       mongoose.disconnect();
//       process.exit(1);
//     });
// };

// fetchProducts();
