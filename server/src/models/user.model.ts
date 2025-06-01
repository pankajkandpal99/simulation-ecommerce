import { ROLE } from "../config/constants.js";
import { AuthProvider } from "../types/model/i-model.js";
import { IUser } from "../types/model/i-user-model.js";
import { model, Schema } from "mongoose";

const UserSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      minlength: [3, "Full name must be at least 3 characters"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      validate: {
        validator: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        message: "Invalid email format",
      },
    },
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      validate: {
        validator: (v: string) => /^[0-9]{10}$/.test(v),
        message: "Phone number must be 10 digits",
      },
    },
    role: {
      type: String,
      enum: Object.values(ROLE),
      default: ROLE.USER,
    },
    avatar: String,
    lastLogin: Date,
    lastActive: Date,
    isVerified: {
      type: Boolean,
      default: false,
    },
    provider: {
      type: String,
      enum: Object.values(AuthProvider),
    },
    providerId: String,
    preferences: Schema.Types.Mixed,
    sessions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Session",
      },
    ],
    isGuest: {
      type: Boolean,
      default: false,
    },
    guestId: String,
    guestExpiresAt: Date,
    addresses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Address",
      },
    ],
    defaultAddress: {
      type: Schema.Types.ObjectId,
      ref: "Address",
    },
    cart: {
      type: Schema.Types.ObjectId,
      ref: "Cart",
    },
    orders: [
      {
        type: Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
  },
  {
    timestamps: true,
    collection: "users",
    toJSON: {
      transform: (doc: any, ret: any) => {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  }
);

UserSchema.index({ email: 1 });
UserSchema.index({ phoneNumber: 1 });
UserSchema.index({ guestId: 1 });

export const User = model<IUser>("User", UserSchema);
