/* eslint-disable @typescript-eslint/no-unused-vars */
import AppError from "../../errorHelpers/appError";
import { EIsActive, IAuthProvider, IUser } from "../user/user.interface";
import httpStatusCodes from "http-status-codes";
import { User } from "../user/user.model";
import bcryptjs from "bcryptjs";
import { generateToken, verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { createNewAccessTokenWithRefreshToken, createUserTokens } from "../../utils/createUserTokens";
import { JwtPayload } from "jsonwebtoken";
import becryptjs from "bcryptjs";

// const credentialsLogin = async(payload: Partial<IUser>) =>{
//   const {email, password} = payload;

//   const isUserExist = await User.findOne({email});

//   if(!isUserExist){
//     throw new AppError(httpStatusCodes.BAD_REQUEST, "Email does not exist");
//   }

//   const isPasswordMatched = await bcryptjs.compare(password as string, isUserExist.password as string);

//   if(!isPasswordMatched){
//     throw new AppError(httpStatusCodes.BAD_REQUEST, "Incorrect password");
//   }

//   const userTokens = createUserTokens(isUserExist);
 

//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const {password: pass, ...rest} = isUserExist.toObject();

//   return {
//     accessToken: userTokens.accessToken,
//     refreshToken: userTokens.refreshToken,
//     user: rest
//   }
// }

const getNewAccessToken = async(refreshToken: string) =>{
  const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken);

  return {
    accessToken: newAccessToken
  }
}

const changePassword = async(oldPassword: string, newPassword: string, decodedToken: JwtPayload) =>{
  const user = await User.findById(decodedToken.userId);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const isOldPasswordMatched = await becryptjs.compare(oldPassword, user!.password as string);

  if(!isOldPasswordMatched){
    throw new AppError(httpStatusCodes.UNAUTHORIZED, "Old password does not match");
  }

  const newHashedPassword = await bcryptjs.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND));

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  user!.password = newHashedPassword;

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  user!.save();

}

const resetPassword = async(oldPassword: string, newPassword: string, decodedToken: JwtPayload) =>{
  return {}

}

const setPassword = async(userId: string, plainPassword: string) =>{
  const user = await User.findById(userId);

  if(!user){
    throw new AppError(httpStatusCodes.NOT_FOUND, "User Not Found");
  }

  if(user.password && user.auths.some(providerObject => providerObject.provider === "google")){
    throw new AppError(httpStatusCodes.BAD_REQUEST, "You already have a password. You can change your password from your profile password change option.")
  }

  const hashedPassword = await bcryptjs.hash(plainPassword, Number(envVars.BCRYPT_SALT_ROUND));

  const credentialProvider: IAuthProvider = {
    provider: "credentials",
    providerId: user.email
  }

  const auths : IAuthProvider[] = [...user.auths, credentialProvider];

  user.password = hashedPassword;

  user.auths = auths;

  await user.save();

}

export const AuthServices = {
  // credentialsLogin,
  getNewAccessToken,
  changePassword,
  resetPassword,
  setPassword
}