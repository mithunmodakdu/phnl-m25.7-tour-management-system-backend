import { NextFunction, Request, Response } from "express";
import httpStatusCodes from "http-status-codes";
import { UserServices } from "./user.service";
// import AppError from "../../errorHelpers/appError";
import { catchAsync } from "../../utils/catchAsync";


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

  res.status(httpStatusCodes.CREATED).json({
    message: "User created successfully.",
    user,
  });

})  

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getAllUsers = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
  const users = await UserServices.getAllUsers();

  res.status(httpStatusCodes.OK).json({
    success: true,
    message: "All users retrieved successfully.",
    data: users
  })
  
})

export const UserControllers = {
  createUser,
  getAllUsers
};
