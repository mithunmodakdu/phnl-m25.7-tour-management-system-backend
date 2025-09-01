import { Types } from "mongoose";
import { IUser } from "../user/user.interface";
import { ITour } from "../tour/tour.interface";
import { IPayment } from "../payment/payment.interface";

export enum EBookingStatus {
  PENDING = "PENDING",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED"
}

export interface IBooking {
  user: Types.ObjectId;
  tour: Types.ObjectId;
  payment?: Types.ObjectId;
  guestCount: number;
  status: EBookingStatus;
  createdAt?: Date;
}