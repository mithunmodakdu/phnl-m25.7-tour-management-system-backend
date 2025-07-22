import { Request, Response } from "express";
import { User } from "./user.model";
import httpStatusCodes from "http-status-codes";

const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;
    const user = await User.create({
      name,
      email,
    });

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
  createUser
}