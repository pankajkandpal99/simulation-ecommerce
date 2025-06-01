import { ICategory } from "../types/model/i-category-model.js";
import { Schema } from "mongoose";
import { model } from "mongoose";

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
    },
    image: String,
    parent: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: "categories",
  }
);

CategorySchema.index({ slug: 1 });
CategorySchema.index({ parent: 1 });

export const Category = model<ICategory>("Category", CategorySchema);
