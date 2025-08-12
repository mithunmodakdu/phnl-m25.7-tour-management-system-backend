import mongoose from "mongoose"
import { IGenericErrorResponse } from "../interfaces/error.interfaces"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const handleCastError = (error: mongoose.Error.CastError): IGenericErrorResponse =>{
  return {
    statusCode: 400,
    message: "Cast Error"
  }
}