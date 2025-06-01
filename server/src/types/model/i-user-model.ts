import { Types } from "mongoose";
import { AuthProvider } from "./i-model.js";
import { ROLE } from "../../config/constants.js";

export interface IUser extends Document {
  _id: Types.ObjectId;
  fullName: string;
  email: string;
  password?: string;
  phoneNumber: string;
  role: ROLE;
  avatar?: string;
  lastLogin?: Date;
  lastActive?: Date;
  isVerified: boolean;
  provider?: AuthProvider;
  providerId?: string;
  preferences?: any;
  sessions?: Types.ObjectId[];
  isGuest: boolean;
  guestId?: string;
  guestExpiresAt?: Date;
  addresses?: Types.ObjectId[];
  defaultAddress?: Types.ObjectId;
  cart?: Types.ObjectId;
  orders?: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}
