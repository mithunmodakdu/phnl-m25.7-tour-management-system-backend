import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import httpStatusCodes from "http-status-codes";
import { AuthServices } from "./auth.service";
import AppError from "../../errorHelpers/appError";
import { setAuthCookie } from "../../utils/setAuthCookie";
import { createUserTokens } from "../../utils/createUserTokens";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) =>{
  const loginInfo = await AuthServices.credentialsLogin(req.body);
  
  setAuthCookie(res, loginInfo);

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

 setAuthCookie(res, tokenInfo);
  
  sendResponse(res, {
    statusCode: httpStatusCodes.OK,
    success: true,
    message: "New Access Token with Refresh Token created successfully.",
    data: tokenInfo,
  })

}) 

const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) =>{
  
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax"
  })

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax"

  })
  
  sendResponse(res, {
    statusCode: httpStatusCodes.OK,
    success: true,
    message: "User logged out successfully.",
    data: null,
  })

}) 

const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) =>{
  const newPassword = req.body.newPassword;
  const oldPassword = req.body.oldPassword;
  const decodedToken = req.user;

  await AuthServices.resetPassword(oldPassword, newPassword, decodedToken as JwtPayload ); 
  
  sendResponse(res, {
    statusCode: httpStatusCodes.OK,
    success: true,
    message: "Password changed successfully.",
    data: null,
  })

}) 

const googleCallbackController= catchAsync(async (req: Request, res: Response, next: NextFunction) =>{
  
  let redirectTo = req.query.state? req.query.state as string : "";
 
  if(redirectTo.startsWith("/")){
    redirectTo = redirectTo.slice(1);
  }
  
  const user = req.user;
  console.log(user)

  if(!user){
    throw new AppError(httpStatusCodes.NOT_FOUND, "User NOT Found");
  }

  const tokenInfo =  createUserTokens(user);

  setAuthCookie(res, tokenInfo);
  
  res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`);

}) 

export const AuthControllers = {
  credentialsLogin,
  getNewAccessToken,
  logout,
  resetPassword,
  googleCallbackController
}