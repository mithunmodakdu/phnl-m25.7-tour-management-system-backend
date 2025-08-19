import { model, Schema } from "mongoose";
import { EPaymentStatus, IPayment } from "./payment.interface";

export const paymentSchema = new Schema<IPayment>(
  {
    booking: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      unique: true
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true
    },
    paymentGatewayData:{
      type: Schema.Types.Mixed
    },
    invoiceUrl:{
      type: String
    },
    status: {
      type: String,
      enum: Object.values(EPaymentStatus),
      default: EPaymentStatus.UNPAID
    }
    
  },
  {
    timestamps: true
  }
);

export const Payment = model<IPayment>("Payment", paymentSchema);