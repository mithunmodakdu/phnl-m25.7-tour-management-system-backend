/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/appError";
import { handleZodError } from "../errorHelpers/handleZodError";
import { handleDuplicateError } from "../errorHelpers/handleDuplicateError";
import { handleCastError } from "../errorHelpers/handleCastError";
import { handleValidationError } from "../errorHelpers/handleValidationError";
import { IErrorSources } from "../interfaces/error.interfaces";

export const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {

  if(envVars.NODE_ENV === "development"){
    console.log(error)
  }

  let statusCode = 500;
  let message = `Something Went Wrong!!`;
  let errorSources: IErrorSources[] = [];

  // :::: Zod error ::::
  if (error.name === "ZodError") {
    const simplifiedError = handleZodError(error);
    statusCode = simplifiedError.statusCode;
    errorSources = simplifiedError.errorSources as IErrorSources[];
    message = simplifiedError.message;
  }

  // :::: Duplicate error ::::
  else if (error.code === 11000) {
    const simplifiedError = handleDuplicateError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  }

  // :::: Mongoose CastError ::::
  else if (error.name === "CastError") {
    const simplifiedError = handleCastError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  }

  // :::: Mongoose ValidationError ::::
  else if (error.name === "ValidationError") {
    const simplifiedError = handleValidationError(error);
    statusCode = simplifiedError.statusCode;
    errorSources = simplifiedError.errorSources as IErrorSources[];
    message = simplifiedError.message;
  } 
  
  
  else if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  } 
  else if (error instanceof Error) {
    statusCode = 500;
    message = error.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    error: envVars.NODE_ENV === "development"? error : null,
    stack: envVars.NODE_ENV === "development" ? error.stack : null,
  });
};
