/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express"
import { envVars } from "../config/env"

export const globalErrorHandler = (error: any, req: Request, res:Response, next: NextFunction)=>{
 const statusCode = 500;
 const message = `Something Went Wrong. ${error.message}`;
 
  res.status(statusCode).json({
    success: false,
    message,
    error,
    stack: envVars.NODE_ENV === "development"? error.stack : null
  })
}