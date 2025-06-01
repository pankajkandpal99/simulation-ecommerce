import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, Minus } from "lucide-react";
import { Button } from "../components/ui/button";
import { IProduct } from "../sections/Home/ProductCard";
import { useAppSelector } from "../hooks/redux";
import { AddToCartButton } from "../components/general/AddToCart";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products } = useAppSelector((state) => state.prodcuts);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedVariant, setSelectedVariant] = useState<string>("");
  const [selectedVariantValue, setSelectedVariantValue] = useState<string>("");
  const [product, setProduct] = useState<IProduct | null>(null);

  useEffect(() => {
    const foundProduct = products.find(
      (p) => p._id.toString() === id?.toString()
    );

    if (foundProduct) {
      setProduct(foundProduct);

      if (foundProduct.variants.length > 0) {
        const firstVariantType = foundProduct.variants[0].name;
        setSelectedVariant(firstVariantType);

        const firstVariantValue = foundProduct.variants.find(
          (v) => v.name === firstVariantType
        )?.value;
        if (firstVariantValue) {
          setSelectedVariantValue(firstVariantValue);
        }
      }
    }
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            {id ? "Loading product..." : "Product not found"}
          </h1>
          <Button onClick={() => navigate(-1)} className="mt-4">
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const variantTypes = Array.from(new Set(product.variants.map((v) => v.name)));

  const variantValues = Array.from(
    new Set(
      product.variants
        .filter((v) => v.name === selectedVariant)
        .map((v) => v.value)
    )
  );

  return (
    <div className="">
      <div className="max-w-7xl mx-auto">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          ← Back to Products
        </Button>

        <div className="lg:grid lg:grid-cols-2 lg:gap-8">
          {/* Product Image */}
          <div className="mb-8 lg:mb-0">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:pl-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {product.title}
            </h1>
            <p className="text-xl font-semibold text-gray-900 mb-4">
              ₹{product.price.toLocaleString()}
            </p>

            <p className="text-gray-600 mb-6">{product.description}</p>

            {/* Variant Type Selector */}
            {variantTypes.length > 1 && (
              <div className="mb-4">
                <label
                  htmlFor="variant-type"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Select Variant Type
                </label>
                <select
                  value={selectedVariant}
                  onChange={(e) => {
                    setSelectedVariant(e.target.value);
                    setSelectedVariantValue("");
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  {variantTypes.map((type) => (
                    <option key={type} value={type} className="bg-primary">
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Variant Value Selector */}
            {variantValues.length > 0 && (
              <div className="mb-6">
                <label
                  htmlFor="variant-value"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Select {selectedVariant}
                </label>
                <select
                  value={selectedVariantValue}
                  onChange={(e) => setSelectedVariantValue(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  {variantValues.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-8">
              <label
                htmlFor="quantity"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Quantity
              </label>
              <div className="flex items-center">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 border border-gray-300 rounded-l-md"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="w-20 p-2 border-t border-b border-gray-300 text-center"
                />
                <button
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  className="p-2 border border-gray-300 rounded-r-md"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <AddToCartButton
              productId={product._id}
              quantity={1}
              variant={
                product.variants.length > 0
                  ? {
                      name: product.variants[0].name,
                      value: product.variants[0].value,
                    }
                  : undefined
              }
              price={product.price}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
