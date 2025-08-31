import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatusCodes from "http-status-codes";
import { OTPServices } from "./otp.service";

const sendOTP = catchAsync(
  async(req: Request, res: Response) =>{
    const {name, email} = req.body;
    await OTPServices.sendOTP(name, email);
    
    sendResponse(res, {
      statusCode: httpStatusCodes.OK,
      success: true, 
      message: "OTP sent successfully.",
      data: null
    })
  }
);

const verifyOTP = catchAsync(
  async(req: Request, res: Response) =>{


    sendResponse(res, {
      statusCode: httpStatusCodes.OK,
      success: true, 
      message: "OTP verified successfully.",
      data: null
    })
  }
);

export const OTPControllers = {
  sendOTP,
  verifyOTP
}