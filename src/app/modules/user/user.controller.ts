import { NextFunction, Request, Response } from "express";
import httpStatusCodes, { StatusCodes } from "http-status-codes";
import { UserServices } from "./user.service";
import AppError from "../../errorHelpers/appError";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {

    // throw new Error("fakeeeeeeeeeeee eroro");
    // throw new AppError(StatusCodes.BAD_REQUEST, "fake error");

    const user = await UserServices.createUser(req.body);

    res.status(httpStatusCodes.CREATED).json({
      message: "User created successfully.",
      user,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
      next(error);
  }
};

export const UserControllers = {
  createUser,
};
