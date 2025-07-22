import { Request, Response } from "express";
import httpStatusCodes from "http-status-codes";
import { UserServices } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const user = await UserServices.createUser(req.body);

    res.status(httpStatusCodes.CREATED).json({
      message: "User created successfully.",
      user,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error);
    res.status(httpStatusCodes.BAD_REQUEST).json({
      message: `Something went wrong. ${error.message}`,
    });
  }
};

export const UserControllers = {
  createUser,
};
