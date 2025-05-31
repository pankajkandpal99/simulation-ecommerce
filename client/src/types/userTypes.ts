/* eslint-disable @typescript-eslint/no-explicit-any */
export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR",
}

export enum AuthProvider {
  LOCAL = "LOCAL",
  GOOGLE = "GOOGLE",
  FACEBOOK = "FACEBOOK",
  APPLE = "APPLE",
}

export interface UserPreferences {
  // Define preferences structure as per your application needs
  [key: string]: any;
}

export interface GameProgress {
  // Define game progress structure as per your application needs
  [key: string]: any;
}

export interface UserStats {
  // Define user stats structure as per your application needs
  [key: string]: any;
}

export interface UserSession {
  id: string;
  // Add other session properties as needed
}

export interface UserData {
  _id: string;
  email?: string;
  phoneNumber: string;
  role: Role;
  username?: string;
  avatar?: string;
  lastLogin?: Date;
  lastActive?: Date;
  isVerified: boolean;
  provider?: AuthProvider;
  providerId?: string;
  gameProgress?: GameProgress;
  preferences?: UserPreferences;
  sessions?: UserSession[];
  stats?: UserStats;
  isGuest: boolean;
  guestId?: string;
  guestExpiresAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserState {
  currentUser: UserData | null;
  loading: boolean;
  error: string | null;
}
