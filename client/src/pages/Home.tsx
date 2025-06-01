import React, { useEffect, useState } from "react";
import { ShoppingCart, Star, Plus, Minus } from "lucide-react";
import HeroSection from "../sections/Home/HeroSection";
import { ProductCard, IProduct, IVariant } from "../sections/Home/ProductCard";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import {
  fetchAllProducts,
  setFeaturedProducts,
} from "../features/product/product.slice";

const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { featuredProducts } = useAppSelector((state) => state.prodcuts);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [selectedVariants, setSelectedVariants] = useState<{
    [key: string]: string;
  }>({});
  const [quantity, setQuantity] = useState(1);

  const handleViewProduct = (product: IProduct) => {
    setSelectedProduct(product);
    setSelectedVariants({});
    setQuantity(1);
  };

  const handleVariantChange = (variantName: string, value: string) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [variantName]: value,
    }));
  };

  const handleBuyNow = () => {
    if (selectedProduct) {
      console.log("Proceeding to checkout with:", {
        product: selectedProduct,
        variants: selectedVariants,
        quantity,
      });
      // Here you would redirect to checkout page
      alert(
        `Proceeding to checkout with ${quantity}x ${selectedProduct.title}`
      );
    }
  };

  const getVariantGroups = (variants: IVariant[]) => {
    const groups: { [key: string]: IVariant[] } = {};
    variants.forEach((variant) => {
      if (!groups[variant.name]) {
        groups[variant.name] = [];
      }
      groups[variant.name].push(variant);
    });
    return groups;
  };

  useEffect(() => {
    dispatch(fetchAllProducts())
      .unwrap()
      .then((products) => {
        // Set first 3 as featured if there are enough products
        if (products.length >= 3) {
          dispatch(setFeaturedProducts(products.slice(0, 3)));
        }
      });
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <HeroSection />

        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-foreground">
              Featured Products
            </h2>
            <p className="text-muted-foreground">
              {featuredProducts.length} products
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onViewProduct={handleViewProduct}
              />
            ))}
          </div>
        </section>
      </main>

      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-foreground">
                  Product Details
                </h2>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="aspect-square bg-muted rounded-xl overflow-hidden">
                    <img
                      src={selectedProduct.images[0]}
                      alt={selectedProduct.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {selectedProduct.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {selectedProduct.images.slice(1).map((image, index) => (
                        <div
                          key={index}
                          className="aspect-square bg-muted rounded-lg overflow-hidden"
                        >
                          <img
                            src={image}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                      {selectedProduct.title}
                    </h1>
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(selectedProduct.rating || 0)
                                ? "text-yellow-400 fill-current"
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-muted-foreground">
                        ({selectedProduct.reviews || 0} reviews)
                      </span>
                    </div>
                    <p className="text-4xl font-bold text-primary mb-4">
                      ₹{selectedProduct.price.toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-muted-foreground leading-relaxed">
                      {selectedProduct.description}
                    </p>
                  </div>

                  {Object.entries(
                    getVariantGroups(selectedProduct.variants)
                  ).map(([name, variants]) => (
                    <div key={name}>
                      <h3 className="font-semibold text-foreground mb-3">
                        Select {name}:
                      </h3>
                      <div className="grid grid-cols-3 gap-2">
                        {variants.map((variant, index) => (
                          <button
                            key={index}
                            onClick={() =>
                              handleVariantChange(name, variant.value)
                            }
                            className={`p-3 rounded-lg border transition-all ${
                              selectedVariants[name] === variant.value
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            <div className="text-sm font-medium">
                              {variant.value}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Stock: {variant.stock}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div>
                    <h3 className="font-semibold text-foreground mb-3">
                      Quantity:
                    </h3>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2 rounded-lg border border-border hover:bg-muted"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-xl font-semibold px-4">
                        {quantity}
                      </span>
                      <button
                        onClick={() =>
                          setQuantity(
                            Math.min(selectedProduct.stock, quantity + 1)
                          )
                        }
                        className="p-2 rounded-lg border border-border hover:bg-muted"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleBuyNow}
                    className="w-full bg-primary text-primary-foreground py-4 px-6 rounded-xl font-semibold text-lg hover:bg-primary/90 transition-colors flex items-center justify-center space-x-3"
                  >
                    <ShoppingCart className="w-6 h-6" />
                    <span>
                      Buy Now - ₹
                      {(selectedProduct.price * quantity).toLocaleString()}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
