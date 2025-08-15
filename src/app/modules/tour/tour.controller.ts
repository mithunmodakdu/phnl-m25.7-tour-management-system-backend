import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { TourServices } from "./tour.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatusCodes from "http-status-codes";


const createTourType = catchAsync(
  async(req: Request, res: Response) =>{
    const result = await TourServices.createTourType(req.body);

    sendResponse(res, {
      statusCode: httpStatusCodes.CREATED,
      success: true,
      message: "Tour type created successfully.",
      data: result
    })

  }
);

const getAllTourTypes = catchAsync(
  async(req: Request, res: Response) =>{
    const result = await TourServices.getAllTourTypes();
    
    sendResponse(res, {
      statusCode: httpStatusCodes.OK,
      success: true,
      message: "All Tour Types retrieved successfully.",
      data: result
    })
  }
);

const createTour = catchAsync(
  async(req: Request, res: Response) =>{
    const result = await TourServices.createTour(req.body);

    sendResponse(res, {
      statusCode: httpStatusCodes.CREATED,
      success: true,
      message: "Tour created successfully.",
      data: result
    })
  }
);

export const TourControllers = {
  createTour,
  createTourType,
  getAllTourTypes
}