import crypto from "crypto";
import { redisClient } from "../../config/redis.config";
import { sendEmail } from "../../utils/sendEmail";
import AppError from "../../errorHelpers/appError";
import { User } from "../user/user.model";
import httpStatusCodes from "http-status-codes";

const OTP_EXPIRATION = 2 * 60  //2 minutes * 60 = 120 seconds

const generateOTP = (length = 6) =>{
  
  //OTP length is 6
  // crypto.randomInt() will take two arguments min, max.  max will be excluded.
  //if OTP length is 6 digit minimum number will be 100000 = 10 power 5 = 10 ** 5
  // maximum number will be 1000000 = 10 power 6 = 10 ** 6
  //maximum number will be excluded and will take upto 999999 that is 6 digit

  const otp = crypto.randomInt(10 ** (length - 1), 10 ** length).toString();

  return otp;

}

const sendOTP = async(name: string, email: string) =>{
  const user = await User.findOne({email});

  if(!user){
    throw new AppError(httpStatusCodes.NOT_FOUND, "User Not Found");
  }

  if(user.isVerified){
    throw new AppError(httpStatusCodes.BAD_REQUEST, "You are already verified.")
  }
  
  const otp = generateOTP();

  const redisKey = `otp:${email}`;

  await redisClient.set(redisKey, otp, {
    expiration: {
      type: "EX",  //EX used for seconds
      value: OTP_EXPIRATION 
    }}
  );

  await sendEmail(
    {
      to: email,
      subject: "Your OTP Code",
      templateName: "otp",
      templateData: {
        name: name,
        otp: otp
      }
    }
  )

}

const verifyOTP = async(email: string, otp: string) =>{
  const user = await User.findOne({email});

  if(!user){
    throw new AppError(httpStatusCodes.NOT_FOUND, "User Not Found");
  }

  if(user.isVerified){
    throw new AppError(httpStatusCodes.BAD_REQUEST, "You are already verified.")
  }

  const redisKey = `otp:${email}`;

  const savedOtp = await redisClient.get(redisKey);

  if(!savedOtp){
    throw new AppError(401, "Invalid OTP")
  }

  if(savedOtp !== otp){
    throw new AppError(401, "Invalid OTP")
  }

  await Promise.all([
    User.updateOne({email}, {isVerified: true}, {runValidators: true}),
    redisClient.del([redisKey])
  ])

}

export const OTPServices = {
  sendOTP,
  verifyOTP
}