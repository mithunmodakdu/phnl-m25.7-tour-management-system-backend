import AppError from "../../errorHelpers/appError";
import { EIsActive, IUser } from "../user/user.interface";
import httpStatusCodes from "http-status-codes";
import { User } from "../user/user.model";
import bcryptjs from "bcryptjs";
import { generateToken, verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { createNewAccessTokenWithRefreshToken, createUserTokens } from "../../utils/createUserTokens";
import { JwtPayload } from "jsonwebtoken";

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

  const userTokens = createUserTokens(isUserExist);
 

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {password: pass, ...rest} = isUserExist.toObject();

  return {
    accessToken: userTokens.accessToken,
    refreshToken: userTokens.refreshToken,
    user: rest
  }
}

const getNewAccessToken = async(refreshToken: string) =>{
  const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken);

  return {
    accessToken: newAccessToken
  }
}

export const AuthServices = {
  credentialsLogin,
  getNewAccessToken
}