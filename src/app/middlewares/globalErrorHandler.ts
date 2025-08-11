/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express"
import { envVars } from "../config/env"
import AppError from "../errorHelpers/appError";

export const globalErrorHandler = (error: any, req: Request, res:Response, next: NextFunction)=>{

console.log(error)

 let statusCode = 500;
 let message = `Something Went Wrong!!`;

//  Mongoose Duplicate error
 if(error.code === 11000){
   console.log("Duplicate error", error.message)
   statusCode = 400;
   // message = "Duplicate error occurred"
   const duplicate = error.message.match(/"([^"]*)"/);
   console.log(duplicate)
   message = `${duplicate[1]} already exists.`
 }
 //  Mongoose Cast error
 else if(error.name === "CastError"){
   statusCode = 400;
   message = "Invalid MongoDB ObjectID. Please provide a valid ObjectID."
 }
 else if(error instanceof AppError){
    statusCode = error.statusCode;
    message = error.message;

 }else if(error instanceof Error){
    statusCode = 500;
    message = error.message;
 }
 
  res.status(statusCode).json({
    success: false,
    message,
    error,
    stack: envVars.NODE_ENV === "development"? error.stack : null
  })
}