import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import httpStatusCodes from "http-status-codes";
import { AuthServices } from "./auth.service";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) =>{
  const loginInfo = await AuthServices.credentialsLogin(req.body);
  
  sendResponse(res, {
    statusCode: httpStatusCodes.OK,
    success: true,
    message: "User login successful.",
    data: loginInfo,
  })

}) 

export const AuthControllers = {
  credentialsLogin
}