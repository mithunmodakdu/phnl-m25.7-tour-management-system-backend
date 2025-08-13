import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { DivisionServices } from "./division.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatusCodes from "http-status-codes";

const createDivision = catchAsync(
  async(req: Request, res: Response, next: NextFunction) =>{
  const division = await DivisionServices.createDivision(req.body);

  sendResponse(res, {
    statusCode: httpStatusCodes.CREATED,
    success: true,
    message: "Division created successfully",
    data: division
  })
 }
)

export const DivisionControllers = {
  createDivision
}