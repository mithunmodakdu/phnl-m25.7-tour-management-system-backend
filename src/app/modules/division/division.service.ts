import AppError from "../../errorHelpers/appError";
import { IDivision } from "./division.interface";
import { Division } from "./division.model";
import httpStatusCodes from "http-status-codes";

const createDivision = async (payload: IDivision) => {
  const baseSlug = payload.name.toLowerCase().split(" ").join("-");
  let slug = `${baseSlug}-division`;

  let counter = 0;
  while (await Division.exists({ slug })) {
    slug = `${slug}-${counter++}`;
  }

  payload.slug = slug;

  // const isDivisionExist = await Division.findOne({name: payload.name});

  // if(isDivisionExist){
  //   throw new AppError(httpStatusCodes.BAD_REQUEST, "Division with this name already exists.")
  // }

  const division = await Division.create(payload);

  return division;
};

const getAllDivisions = async () => {
  const divisions = await Division.find();
  const totalDivisions = await Division.countDocuments();

  return {
    data: divisions,
    meta: {
      total: totalDivisions,
    },
  };
};

const getSingleDivision = async (slug: string) => {
  return await Division.findOne({ slug });
};

const updateDivision = async (id: string, payload: Partial<IDivision>) => {
  const existingDivision = await Division.findById(id);

  if (!existingDivision) {
    throw new AppError(httpStatusCodes.NOT_FOUND, "Division not found.");
  }

  const duplicateDivision = await Division.findOne({
    name: payload.name,
    _id: { $ne: id },
  });

  if (duplicateDivision) {
    throw new AppError(
      httpStatusCodes.BAD_REQUEST,
      "Division with this name already exist."
    );
  }

  if (payload.name) {
    const baseSlug = payload.name.toLowerCase().split(" ").join("-");
    let slug = `${baseSlug}-division`;

    let counter = 0;
    while (await Division.exists({ slug })) {
      slug = `${slug}-${counter++}`;
    }

    payload.slug = slug;
  }

  const updatedDivision = await Division.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return updatedDivision;
};

const deleteDivision = async (id: string) => {
  await Division.findByIdAndDelete(id);
  return null;
};

export const DivisionServices = {
  createDivision,
  getAllDivisions,
  getSingleDivision,
  updateDivision,
  deleteDivision,
};
