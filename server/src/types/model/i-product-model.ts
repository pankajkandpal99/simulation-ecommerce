import { Types, Document } from "mongoose";

export interface IVariant {
  name: string;
  value: string;
  price?: number;
  stock: number;
  sku?: string;
}

export interface IProduct extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: Types.ObjectId;
  variants: IVariant[];
  stock: number;
  sku: string;
  isActive: boolean;
  tags: string[];
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  createdAt: Date;
  updatedAt: Date;
}
