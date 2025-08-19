import AppError from "../../errorHelpers/appError";
import { User } from "../user/user.model";
import { EBookingStatus, IBooking } from "./booking.interface";
import httpStatusCodes  from "http-status-codes";
import { Booking } from "./booking.model";
import { Payment } from "../payment/payment.model";
import { EPaymentStatus } from "../payment/payment.interface";
import { Tour } from "../tour/tour.model";

const getTransactionId = () =>{
  return `tran_${Date.now()}_${Math.floor(Math.random()*1000)}`
}

const createBooking = async (payload: Partial<IBooking>, userId: string) => {
  const transactionId = getTransactionId();
  const user = await User.findById(userId);
  
  if(!user?.phone || !user?.address ){
    throw new AppError(httpStatusCodes.BAD_REQUEST, "Please update your profile to book a tour");
  }
  
  const tour = await Tour.findById(payload.tour).select("costFrom");

  if(!tour?.costFrom){
    throw new AppError(httpStatusCodes.BAD_REQUEST, "No tour cost found.")
  }

  const amount = Number(tour.costFrom) * Number(payload.guestCount);

  const booking = await Booking.create({
    user: userId,
    status: EBookingStatus.PENDING,
    ...payload
  })

  const payment = await Payment.create({
    booking: booking._id,
    status: EPaymentStatus.UNPAID,
    transactionId: transactionId,
    amount: amount
  })

  const updatedBooking = await Booking.findByIdAndUpdate(
    booking._id, 
    {payment: payment._id}, 
    {new: true, runValidators: true}
  ).populate("user", "name email phone address")
   .populate("tour", "title, costFrom")
   .populate("payment")
  
  return updatedBooking
};

const getUserBookings = async () => {

    return {}
};

const getBookingById = async () => {
    return {}
};

const updateBookingStatus = async (

) => {

    return {}
};

const getAllBookings = async () => {

    return {}
};


export const BookingService = {
    createBooking,
    getUserBookings,
    getBookingById,
    updateBookingStatus,
    getAllBookings,
};