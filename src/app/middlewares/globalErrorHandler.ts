/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/appError";
import { handleZodError } from "../Helpers/handleZodError";
import { handleDuplicateError } from "../Helpers/handleDuplicateError";
import { handleCastError } from "../Helpers/handleCastError";
import { handleValidationError } from "../Helpers/handleValidationError";
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

  
  // :::: Duplicate error ::::
  if (error.code === 11000) {
    const simplifiedError = handleDuplicateError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  }

  // :::: Mongoose CastError/ ObjectId Error ::::
  else if (error.name === "CastError") {
    const simplifiedError = handleCastError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  }

  // :::: Zod error ::::
  else if (error.name === "ZodError") {
    const simplifiedError = handleZodError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources as IErrorSources[];
  }

  // :::: Mongoose ValidationError ::::
  else if (error.name === "ValidationError") {
    const simplifiedError = handleValidationError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources as IErrorSources[];
    
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
    error: envVars.NODE_ENV === "development" ? error : null,
    stack: envVars.NODE_ENV === "development" ? error.stack : null,
  });
};
