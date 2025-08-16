import AppError from "../../errorHelpers/appError";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";
import httpStatusCodes from "http-status-codes";

// :::: Tour Type ::::
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

const getAllTourTypes = async () => {
  return await TourType.find();
};

const updateTourType = async (id: string, payload: ITourType) => {
  const existingTourType = await TourType.findById(id);
  if (!existingTourType) {
    throw new AppError(httpStatusCodes.NOT_FOUND, "Tour type not found.");
  }
  const updatedTourType = await TourType.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return updatedTourType;
};

const deleteTourType = async (id: string) => {
  const existingTourType = await TourType.findById(id);
  if (!existingTourType) {
    throw new AppError(httpStatusCodes.NOT_FOUND, "This tour type not found");
  }
  return await TourType.findByIdAndDelete(id);
};

// :::: Tour ::::
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

const getAllTours = async () => {
  const tours = await Tour.find();
  const totalTours = await Tour.countDocuments();
  return {
    data: tours,
    meta: {
      total: totalTours,
    },
  };
};

const updateTour = async (id: string, payload: Partial<ITour>) => {
  const existingTour = await Tour.findById(id);
  if (!existingTour) {
    throw new AppError(httpStatusCodes.NOT_FOUND, "This tour not found.");
  }

  const updatedTour = await Tour.findByIdAndUpdate(id, payload, { new: true });
  return updatedTour;
};

const deleteTour = async (id: string) => {
  const existingTour = await Tour.findById(id);
  if (!existingTour) {
    throw new AppError(httpStatusCodes.NOT_FOUND, "This tour not found.");
  }
  return await Tour.findByIdAndDelete(id);
};

export const TourServices = {
  createTour,
  createTourType,
  getAllTourTypes,
  updateTourType,
  deleteTourType,
  getAllTours,
  updateTour,
  deleteTour,
};
