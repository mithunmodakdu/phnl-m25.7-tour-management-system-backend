import { model, Schema } from "mongoose";
import { EBookingStatus, IBooking } from "./booking.interface";

const bookingSchema = new Schema<IBooking>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    tour: {
      type: Schema.Types.ObjectId,
      ref: "Tour",
      required: true
    },
    payment: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
      required: true
    },
    guestCount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: Object.values(EBookingStatus),
      default: EBookingStatus.PENDING
    }
    
  },
  
  {
    timestamps: true
  });


  export const Booking = model<IBooking>("Booking", bookingSchema);