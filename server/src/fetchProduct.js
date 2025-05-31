const https = require("https");

const fetchProducts = () => {
  const url = "https://dummyjson.com/products";

  https
    .get(url, (res) => {
      let data = "";

      // Data chunk receive
      res.on("data", (chunk) => {
        data += chunk;
      });

      // Complete response
      res.on("end", () => {
        try {
          const parsedData = JSON.parse(data);
          const products = parsedData.products;

          console.log("✅ Fetched Products:\n");
          console.log(products);

          // Yahan se tum MongoDB, PostgreSQL, etc. me insert kar sakte ho
          // e.g. insertProductsToDB(products)
        } catch (error) {
          console.error("❌ Error parsing JSON:", error);
        }
      });
    })
    .on("error", (err) => {
      console.error("❌ HTTP request failed:", err.message);
    });
};

fetchProducts();
