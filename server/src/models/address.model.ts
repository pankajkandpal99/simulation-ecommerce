import { IAddress } from "@/types/model/i-address.model.js";
import { Document, model, Schema, Types } from "mongoose";

const AddressSchema = new Schema<IAddress>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      validate: {
        validator: (v: string) => /^[0-9]{10}$/.test(v),
        message: "Phone number must be 10 digits",
      },
    },
    addressLine1: {
      type: String,
      required: [true, "Address line 1 is required"],
      trim: true,
    },
    addressLine2: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },
    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
    },
    zipCode: {
      type: String,
      required: [true, "ZIP code is required"],
      validate: {
        validator: (v: string) => /^[0-9]{5,6}$/.test(v),
        message: "ZIP code must be 5-6 digits",
      },
    },
    country: {
      type: String,
      required: true,
      default: "India",
      trim: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      enum: ["home", "work", "other"],
      default: "home",
    },
  },
  {
    timestamps: true,
    collection: "addresses",
  }
);

AddressSchema.index({ user: 1 });

export const AddressSubSchema = new Schema(
  {
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  { _id: false }
);

export const Address = model<IAddress>("Address", AddressSchema);
