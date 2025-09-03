import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { PaymentServices } from "./payment.service";
import { envVars } from "../../config/env";
import { sendResponse } from "../../utils/sendResponse";
import httpStatusCodes from "http-status-codes";
import { sslService } from "../../sslCommerz/sslCommerz.service";

const initPayment = catchAsync(async(req: Request, res: Response)=>{
  const bookingId = req.params.bookingId;
  const result = await PaymentServices.initPayment(bookingId);
  sendResponse(res, {
    statusCode: httpStatusCodes.OK,
    success: true,
    message: "Payment completed successfully.",
    data: result
  })
});

const successPayment = catchAsync(async(req: Request, res: Response) =>{
  const query = req.query;
  const result = await PaymentServices.successPayment(query as Record<string, string>);
  if(result?.success){
    res.redirect(`${envVars.SSL.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`)
  }
})

const failedPayment = catchAsync(async(req: Request, res: Response) =>{
  const query = req.query;
  const result = await PaymentServices.failedPayment(query as Record<string, string>);
  if(!result?.success){
    res.redirect(`${envVars.SSL.SSL_FAIL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result?.message}&amount=${query.amount}&status=${query.status}`)
  }
})

const cancelledPayment = catchAsync(async(req: Request, res: Response) =>{
  const query = req.query;
  const result = await PaymentServices.cancelledPayment(query as Record<string, string>);
  if(!result?.success){
    res.redirect(`${envVars.SSL.SSL_CANCEL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result?.message}&amount=${query.amount}&status=${query.status}`)
  }
})

const getInvoiceDownloadUrl = catchAsync(async(req: Request, res: Response) =>{
  const {paymentId} = req.params;
  const result = await PaymentServices.getInvoiceDownloadUrl(paymentId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Invoice Download Url retrieved successfully",
    data: result
  })
  
})

const validatePayment = catchAsync(async(req: Request, res: Response) =>{
  console.log("SSLCommerz IPN URL Body", req.body)
  await sslService.validatePayment(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment validated successfully",
    data: null
  })
  
})

export const PaymentController = {
  initPayment,
  successPayment,
  failedPayment,
  cancelledPayment,
  getInvoiceDownloadUrl,
  validatePayment
}