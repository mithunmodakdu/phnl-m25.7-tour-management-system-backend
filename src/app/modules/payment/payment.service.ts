/* eslint-disable @typescript-eslint/no-explicit-any */
import { EBookingStatus } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model"
import { EPaymentStatus } from "./payment.interface";
import { Payment } from "./payment.model";

const successPayment = async(query: Record<string, string>) =>{
  // update booking status to CONFIRM
  // update payment status to PAID

  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const updatedPayment = await Payment.findOneAndUpdate({transactionId: query.transactionId}, 
      {
        status: EPaymentStatus.PAID
      }, {new: true, runValidators: true, session}
    );

    await Booking.findByIdAndUpdate(updatedPayment?.booking, {
      status: EBookingStatus.COMPLETED
    }, {new: true, runValidators: true, session});

    await session.commitTransaction();
    session.endSession();

    return {success: true, message: "Payment completed successfully."};
    

  } catch (error: any) {
    console.log(error)
    await session.abortTransaction();
    session.endSession();
  }
}

const failedPayment = async() =>{
  // update booking status to CONFIRM
  // update payment status to PAID
}

const cancelledPayment = async() =>{
  // update booking status to CONFIRM
  // update payment status to PAID
}

export const PaymentServices = {
  successPayment,
  failedPayment,
  cancelledPayment
}