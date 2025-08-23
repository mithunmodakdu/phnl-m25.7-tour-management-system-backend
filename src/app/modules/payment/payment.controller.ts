import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { PaymentServices } from "./payment.service";
import { envVars } from "../../config/env";

const successPayment = catchAsync(async(req: Request, res: Response) =>{
  const query = req.query;
  const result = await PaymentServices.successPayment(query as Record<string, string>);
  if(result?.success){
    res.redirect(`${envVars.SSL.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`)
  }
})

const failedPayment = catchAsync(async(req: Request, res: Response) =>{
  // const query = req.query;
  // const result = await PaymentServices.successPayment(query as Record<string, string>);
  // if(result?.success){
  //   res.redirect(envVars.SSL.SSL_SUCCESS_FRONTEND_URL)
  // }
})

const cancelledPayment = catchAsync(async(req: Request, res: Response) =>{
  // const query = req.query;
  // const result = await PaymentServices.successPayment(query as Record<string, string>);
  // if(result?.success){
  //   res.redirect(envVars.SSL.SSL_SUCCESS_FRONTEND_URL)
  // }
})

export const PaymentController = {
  successPayment,
  failedPayment,
  cancelledPayment
}