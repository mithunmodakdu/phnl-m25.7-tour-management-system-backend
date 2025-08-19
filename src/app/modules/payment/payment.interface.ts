import { Types } from "mongoose"

export enum EPaymentStatus {
  PAID = "PAID",
  UNPAID  = "UNPAID",
  CANCELLED  = "CANCELLED",
  FAILED  = "FAILED",
  REFUNDED  = "REFUNDED"
}

export interface IPayment {
  booking: Types.ObjectId;
  transactionId: string;
  amount: number;
  paymentGatewayData?: any;
  invoiceUrl?: string; 
  status: EPaymentStatus

}