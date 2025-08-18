import { NextFunction, Request, Response } from "express";
import httpStatusCodes from "http-status-codes";
import { UserServices } from "./user.service";
// import AppError from "../../errorHelpers/appError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";


// const createUser = async (req: Request, res: Response, next: NextFunction) => {
//   try {

//     // throw new Error("fakeeeeeeeeeeee eroro");
//     // throw new AppError(httpStatusCodes.BAD_REQUEST, "fake error");

//     const user = await UserServices.createUser(req.body);

//     res.status(httpStatusCodes.CREATED).json({
//       message: "User created successfully.",
//       user,
//     });

//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   } catch (error: any) {
//       next(error);
//   }
// };


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) =>{
  const user = await UserServices.createUser(req.body);

  // res.status(httpStatusCodes.CREATED).json({
  //   message: "User created successfully.",
  //   user,
  // });

  sendResponse(res, {
    statusCode: httpStatusCodes.CREATED,
    success: true,
    message: "User created successfully.",
    data: user,
  })

})  


const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) =>{
  
  const userId = req.params.id;
  // const token = req.headers.authorization;
  // const verifiedToken = verifyToken(token as string, envVars.JWT_ACCESS_SECRET) as JwtPayload;
  const verifiedToken = req.user;
  const payload = req.body;
  
  const user = await UserServices.updateUser(userId, payload, verifiedToken as JwtPayload);

  sendResponse(res, {
    statusCode: httpStatusCodes.CREATED,
    success: true,
    message: "User updated successfully.",
    data: user,
  })

})  

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getAllUsers = catchAsync(async(req: Request, res: Response)=>{
  const query = req.query;
  const result = await UserServices.getAllUsers(query as Record<string, string>);

  sendResponse(res, {
    statusCode: httpStatusCodes.OK,
    success: true,
    message: "All users retrieved successfully.",
    meta: result.meta,
    data: result.data,
    
  })

})

export const UserControllers = {
  createUser,
  updateUser,
  getAllUsers
};
