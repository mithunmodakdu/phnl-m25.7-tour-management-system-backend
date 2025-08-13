import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { DivisionServices } from "./division.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatusCodes from "http-status-codes";

const createDivision = catchAsync(
  async(req: Request, res: Response, next: NextFunction) =>{
  
  const result = await DivisionServices.createDivision(req.body);

  sendResponse(res, {
    statusCode: httpStatusCodes.CREATED,
    success: true,
    message: "Division created successfully",
    data: result
  })
 }
)

const getAllDivisions = catchAsync(
  async(req: Request, res:Response) =>{
    
    const result = await DivisionServices.getAllDivisions();

    sendResponse(res, {
      statusCode: httpStatusCodes.OK,
      success: true,
      message: "All divisions retrieved successfully.",
      data: result.data,
      meta: result.meta
    })
  }
);



export const DivisionControllers = {
  createDivision,
  getAllDivisions
}