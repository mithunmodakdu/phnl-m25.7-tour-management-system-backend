import AppError from "../../errorHelpers/appError";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";
import httpStatusCodes from "http-status-codes";

const createTourType = async (payload: ITourType) => {

  const existingTourType = await TourType.findOne({ name: payload.name });

  if (existingTourType) {
    throw new AppError(
      httpStatusCodes.BAD_REQUEST,
      "Tour type with this name already exists."
    );
  }

  const tourType = await TourType.create(payload);

  return tourType;
};

const getAllTourTypes = async() =>{
  return await TourType.find();
}

const createTour = async (payload: ITour) => {
  const existingTour = await Tour.findOne({ title: payload.title });

  if (existingTour) {
    throw new AppError(
      httpStatusCodes.BAD_REQUEST,
      "Tour with this title already exists."
    );
  }

  const tour = await Tour.create(payload);

  return tour;
};

export const TourServices = {
  createTour,
  createTourType,
  getAllTourTypes
};
