/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "../../errorHelpers/appError";
import { sslService } from "../../sslCommerz/sslCommerz.service";
import { generatePDF, IInvoiceData } from "../../utils/invoice";
import { sendEmail } from "../../utils/sendEmail";
import { EBookingStatus } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { ITour } from "../tour/tour.interface";
import { IUser } from "../user/user.interface";
import { EPaymentStatus } from "./payment.interface";
import { Payment } from "./payment.model";
import httpStatusCodes from "http-status-codes";

const initPayment = async(bookingId: string) =>{
 const payment = await Payment.findOne({booking: bookingId});

 if(!payment){
  throw new AppError(httpStatusCodes.NOT_FOUND, "Payment Not Found. You have not booked this tour.")
 }
 
 const booking = await Booking.findById(payment.booking);

  const userName = (booking?.user as any).name;
     const userEmail = (booking?.user as any).email;
     const userPhone = (booking?.user as any).Phone;
     const userAddress = (booking?.user as any).address;
 
     const sslPayload = {
       name: userName,
       email: userEmail,
       phoneNumber: userPhone,
       address: userAddress,
       amount: payment.amount,
       transactionId: payment.transactionId
     }
     const sslPayment = await sslService.sslPaymentInit(sslPayload);
     
     return {
      paymentURL: sslPayment.GatewayPageURL
     }

};

const successPayment = async (query: Record<string, string>) => {
  // update booking status to CONFIRM
  // update payment status to PAID

  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      {
        status: EPaymentStatus.PAID,
      },
      { new: true, runValidators: true, session }
    );

    const updatedBooking = await Booking.findByIdAndUpdate(
      updatedPayment?.booking,
      {
        status: EBookingStatus.COMPLETED,
      },
      { new: true, runValidators: true, session }
    ).populate("tour", "title").populate("user", "name email");

    if(!updatedPayment){
      throw new AppError(404, "Payment NOT Found")
    }

    if(!updatedBooking){
      throw new AppError(404, "Booking NOT Found")
    }

    const invoiceData: IInvoiceData = {
      bookingDate: updatedBooking.createdAt as Date,
      guestsCount: updatedBooking.guestCount,
      totalAmount: updatedPayment.amount,
      tourTitle: (updatedBooking.tour as unknown as ITour).title,
      transactionId: updatedPayment.transactionId,
      userName: (updatedBooking.user as unknown as IUser).name,

    }

    const pdfBuffer = await generatePDF(invoiceData);

    await sendEmail({
      to: (updatedBooking.user as unknown as IUser).email,
      subject: "Your Booking Invoice",
      templateName: "invoice",
      templateData: invoiceData,
      attachments: [
        {
          filename: "invoice.pdf",
          content: pdfBuffer,
          contentType: "application/pdf"
        }
      ]
    })

    await session.commitTransaction();
    session.endSession();

    return { success: true, message: "Payment completed successfully." };

  } catch (error: any) {
    console.log(error);
    await session.abortTransaction();
    session.endSession();
  }
};

const failedPayment = async (query: Record<string, string>) => {
  // update booking status to CONFIRM
  // update payment status to PAID

  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      {
        status: EPaymentStatus.FAILED,
      },
      {runValidators: true, session }
    );

    await Booking.findByIdAndUpdate(
      updatedPayment?.booking,
      {
        status: EBookingStatus.FAILED,
      },
      {runValidators: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    return { success: false, message: "Payment failed." };

  } catch (error: any) {
    console.log(error);
    await session.abortTransaction();
    session.endSession();
  }
};

const cancelledPayment = async (query: Record<string, string>) => {
  // update booking status to CONFIRM
  // update payment status to PAID

  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      {
        status: EPaymentStatus.CANCELLED,
      },
      {runValidators: true, session }
    );

    await Booking.findByIdAndUpdate(
      updatedPayment?.booking,
      {
        status: EBookingStatus.CANCELLED,
      },
      {runValidators: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    return { success: false, message: "Payment cancelled." };
  } catch (error: any) {
    console.log(error);
    await session.abortTransaction();
    session.endSession();
  }
};

export const PaymentServices = {
  initPayment,
  successPayment,
  failedPayment,
  cancelledPayment,
};
