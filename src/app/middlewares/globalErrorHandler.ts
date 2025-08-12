/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express"
import { envVars } from "../config/env"
import AppError from "../errorHelpers/appError";

export const globalErrorHandler = (error: any, req: Request, res:Response, next: NextFunction)=>{

// console.log(error)

 let statusCode = 500;
 let message = `Something Went Wrong!!`;
 const errorSources : any = [];

//  Mongoose Duplicate error
 if(error.code === 11000){
  //  console.log("Duplicate error", error.message)
   statusCode = 400;
   // message = "Duplicate error occurred"
   const duplicate = error.message.match(/"([^"]*)"/);
  //  console.log(duplicate)
   message = `${duplicate[1]} already exists.`
 }

 //  Mongoose CastError
 else if(error.name === "CastError"){
   statusCode = 400;
   message = "Invalid MongoDB ObjectID. Please provide a valid ObjectID."
 }

//  Mongoose ValidationError
 else if(error.name === "ValidationError"){
   statusCode = 400;
      
   const errors = Object.values(error.errors);
   errors.forEach((errorObject: any) => errorSources.push(
    {
      path: errorObject.path,
      message: errorObject.message
    }
   ));
  //  console.log(errorSources);

   message = "Validation Error";
 }

 else if(error instanceof AppError){
    statusCode = error.statusCode;
    message = error.message;

 }
 
 else if(error instanceof Error){
    statusCode = 500;
    message = error.message;
 }
 
  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    // error,
    stack: envVars.NODE_ENV === "development"? error.stack : null
  })
}