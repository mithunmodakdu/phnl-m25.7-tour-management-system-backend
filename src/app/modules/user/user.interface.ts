import { Types } from "mongoose";

export enum ERole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  USER = "USER",
  GUIDE = "GUIDE"
}

export enum EIsActive {
  ACTIVE = "ACTIVE",  
  INACTIVE = "INACTIVE",  
  BLOCKED = "BLOCKED",  
}

export interface IAuthProvider {
  provider: "google" | "credentials";
  providerId: string
}

export interface IUser {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  picture?: string;
  address?: string;
  isDeleted?: boolean;
  isActive?: EIsActive;
  isVerified?: boolean;
  role: ERole;
  auths: IAuthProvider[];
  bookings?: Types.ObjectId[];
  guides?: Types.ObjectId[]

}