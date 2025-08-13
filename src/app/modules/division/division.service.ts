import AppError from "../../errorHelpers/appError";
import { IDivision } from "./division.interface";
import { Division } from "./division.model";
import httpStatusCodes from "http-status-codes";

const createDivision = async (payload: IDivision) =>{
  console.log(payload)

  const isDivisionExist = await Division.findOne({name: payload.name});

  if(isDivisionExist){
    throw new AppError(httpStatusCodes.BAD_REQUEST, "Division with this name already exists.")
  }

  const division = await Division.create(payload);

  return division;
}

export const DivisionServices = {
  createDivision
}