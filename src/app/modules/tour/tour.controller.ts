import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { TourServices } from "./tour.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatusCodes from "http-status-codes";


// :::: Tour Type ::::
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

const updateTourType = catchAsync(
  async(req: Request, res: Response) =>{
    const result = await TourServices.updateTourType(req.params.id, req.body);
    sendResponse(res, {
      statusCode: httpStatusCodes.OK,
      success: true,
      message: "Tour type updated successfully.",
      data: result
    })
  }
);

const deleteTourType = catchAsync(
  async(req: Request, res: Response) =>{
    const result = await TourServices.deleteTourType(req.params.id);
    sendResponse(res, {
      statusCode: httpStatusCodes.OK,
      success: true,
      message: "Tour type deleted successfully.",
      data: result
    })
  }
);


// :::: Tour ::::
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

const getAllTours = catchAsync(
  async(req: Request, res: Response) =>{
    const result = await TourServices.getAllTours();
    sendResponse(res, {
      statusCode: httpStatusCodes.OK,
      success: true,
      message: "All tours retrieved successfully.",
      data: result.data,
      meta: result.meta
    })
  }
);

const updateTour = catchAsync(
  async(req: Request, res: Response) =>{
    const result = await TourServices.updateTour(req.params.id, req.body);
    sendResponse(res, {
      statusCode: httpStatusCodes.OK,
      success: true,
      message: "Tour updated successfully.",
      data: result
    })
  }
);

const deleteTour = catchAsync(
  async(req: Request, res: Response) =>{
    const result = await TourServices.deleteTour(req.params.id);
    sendResponse(res, {
      statusCode: httpStatusCodes.OK,
      success: true,
      message: "Tour deleted successfully.",
      data: result
    })
  }
);

export const TourControllers = {
  createTour,
  createTourType,
  getAllTourTypes,
  updateTourType,
  deleteTourType,
  getAllTours,
  updateTour,
  deleteTour
}