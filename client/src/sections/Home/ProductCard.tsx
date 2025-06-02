/* eslint-disable @typescript-eslint/no-unused-vars */
import { Eye, Heart, Star } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AddToCartButton } from "../../components/general/AddToCart";

export interface IVariant {
  name: string;
  value: string;
  price?: number;
  stock: number;
  sku?: string;
}

export interface IProduct {
  _id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  variants: IVariant[];
  stock: number;
  sku: string;
  isActive: boolean;
  tags: string[];
  weight?: number;
  rating?: number;
  reviews?: number;
  createdAt?: string;
}

export const ProductCard: React.FC<{
  product: IProduct;
  onViewProduct: (product: IProduct) => void;
}> = ({ product, onViewProduct }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <div
      className="group relative bg-card rounded-xl border border-border overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/30"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/products/${product._id}`)}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.images[currentImageIndex]}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Image Navigation Dots */}
        {product.images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {product.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentImageIndex ? "bg-primary" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        )}

        {/* Wishlist Button */}
        <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white">
          <Heart className="w-4 h-4 text-muted-foreground hover:text-destructive" />
        </button>

        {/* Quick View Button */}
        <button
          onClick={() => onViewProduct(product)}
          className="absolute top-3 left-3 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white"
        >
          <Eye className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Rating */}
        <div className="flex items-center space-x-1 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(product.rating || 0)
                    ? "text-yellow-400 fill-current"
                    : "text-muted-foreground"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            ({product.reviews || 0})
          </span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {product.title}
        </h3>

        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xl font-bold text-primary">
            ₹{product.price.toLocaleString()}
          </span>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
            {product.stock} in stock
          </span>
        </div>

        {/* Variants Preview */}
        {product.variants.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-muted-foreground mb-1">
              {product.variants[0].name}:
            </p>
            <div className="flex space-x-1">
              {product.variants.slice(0, 3).map((variant, index) => (
                <span
                  key={index}
                  className="text-xs bg-accent/20 text-accent-foreground px-2 py-1 rounded border"
                >
                  {variant.value}
                </span>
              ))}
              {product.variants.length > 3 && (
                <span className="text-xs text-muted-foreground">
                  +{product.variants.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

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
  );
};
