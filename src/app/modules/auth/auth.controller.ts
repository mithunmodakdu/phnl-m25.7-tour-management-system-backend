import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import httpStatusCodes from "http-status-codes";
import { AuthServices } from "./auth.service";
import AppError from "../../errorHelpers/appError";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) =>{
  const loginInfo = await AuthServices.credentialsLogin(req.body);
  
  res.cookie("accessToken", loginInfo.accessToken, {
    httpOnly: true,
    secure: false
  })
  
  res.cookie("refreshToken", loginInfo.refreshToken, {
    httpOnly: true,
    secure: false
  });

  sendResponse(res, {
    statusCode: httpStatusCodes.OK,
    success: true,
    message: "User login successful.",
    data: loginInfo,
  })

}) 

const getNewAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) =>{
  const refreshToken = req.cookies.refreshToken;

  if(!refreshToken){
    throw new AppError(httpStatusCodes.BAD_REQUEST, "No Refresh Token received from cookies");
  }

  const tokenInfo = await AuthServices.getNewAccessToken(refreshToken as string);
  
  sendResponse(res, {
    statusCode: httpStatusCodes.OK,
    success: true,
    message: "User login successful.",
    data: tokenInfo,
  })

}) 

export const AuthControllers = {
  credentialsLogin,
  getNewAccessToken
}