import { Types } from "mongoose";

export interface IAddress extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
  type: "home" | "work" | "other";
  createdAt: Date;
  updatedAt: Date;
}
