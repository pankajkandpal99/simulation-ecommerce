import { IProduct, IVariant } from "../types/model/i-product-model.js";
import { model, Schema } from "mongoose";

const VariantSchema = new Schema<IVariant>(
  {
    name: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    sku: String,
  },
  { _id: false }
);

const ProductSchema = new Schema<IProduct>(
  {
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    variants: [VariantSchema],
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    weight: {
      type: Number,
      min: 0,
    },
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
    },
  },
  {
    timestamps: true,
    collection: "products",
  }
);

ProductSchema.index({ title: "text", description: "text", tags: "text" });
ProductSchema.index({ category: 1 });
ProductSchema.index({ sku: 1 });
ProductSchema.index({ isActive: 1 });

export const Product = model<IProduct>("Product", ProductSchema);
