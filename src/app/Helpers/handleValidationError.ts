import mongoose from "mongoose";
import { IErrorSources, IGenericErrorResponse } from "../interfaces/error.interfaces";

export const handleValidationError = (error: mongoose.Error.ValidationError): IGenericErrorResponse =>{
    const errors = Object.values(error.errors);
    const errorSources : IErrorSources[] = [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    errors.forEach((errorObject: any) =>
      errorSources.push({
        path: errorObject.path,
        message: errorObject.message,
      })
    );
    
    return {
      statusCode : 400,
      message : "Validation Error",
      errorSources
      
    }
}