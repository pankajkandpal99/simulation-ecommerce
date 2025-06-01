import { ICart, ICartItem } from "../types/model/i-cart.model.js";
import { model, Schema } from "mongoose";

const CartItemSchema = new Schema<ICartItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    variant: {
      name: String,
      value: String,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const CartSchema = new Schema<ICart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    guestId: {
      type: String,
    },
    items: [CartItemSchema],
    subtotal: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    tax: {
      type: Number,
      default: 0,
      min: 0,
    },
    shipping: {
      type: Number,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  },
  {
    timestamps: true,
    collection: "carts",
  }
);

CartSchema.index({ user: 1 });
CartSchema.index({ guestId: 1 });
CartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

CartSchema.pre("save", function (next) {
  this.subtotal = this.items.reduce((sum, item) => sum + item.subtotal, 0);
  this.total = this.subtotal + this.tax + this.shipping;
  next();
});

export const Cart = model<ICart>("Cart", CartSchema);
