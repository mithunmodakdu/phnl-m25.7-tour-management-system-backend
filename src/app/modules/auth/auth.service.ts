import AppError from "../../errorHelpers/appError";
import { IUser } from "../user/user.interface";
import httpStatusCodes from "http-status-codes";
import { User } from "../user/user.model";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateToken } from "../../utils/jwt";
import { envVars } from "../../config/env";

const credentialsLogin = async(payload: Partial<IUser>) =>{
  const {email, password} = payload;

  const isUserExist = await User.findOne({email});

  if(!isUserExist){
    throw new AppError(httpStatusCodes.BAD_REQUEST, "Email does not exist");
  }

  const isPasswordMatched = await bcryptjs.compare(password as string, isUserExist.password as string);

  if(!isPasswordMatched){
    throw new AppError(httpStatusCodes.BAD_REQUEST, "Incorrect password");
  }

  const jwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role
  }

  const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES);



  return {
    accessToken
  }
}

export const AuthServices = {
  credentialsLogin
}