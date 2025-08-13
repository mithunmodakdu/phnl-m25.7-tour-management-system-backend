import AppError from "../../errorHelpers/appError";
import { EIsActive, ERole, IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";
import httpStatusCodes from "http-status-codes";
import bcryptjs from "bcryptjs";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";

const createUser = async (payload: Partial<IUser>) => {
  const {email, password, ...rest } = payload;

  // const isUserExist = await User.findOne({email});

  // if(isUserExist){
  //   throw new AppError(httpStatusCodes.BAD_REQUEST, "User already exist");
  // }

  const hashedPassword = await bcryptjs.hash(password as string, 10);

  const authProvider : IAuthProvider = {
    provider: "credentials",
    providerId: email as string
  }

  const user = await User.create({
    email,
    password: hashedPassword,
    auths: [authProvider],
    ...rest
  });

  return user;
};

const updateUser = async(userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) =>{
  
  /**
   * email--can not be updated
   * role, isDeleted, isVerified ---  only be updated by ADMIN, SUPER_ADMIN
   * promoting to SUPER_ADMIN --- only be updated by SUPER_ADMIN
   * password --- rehashing
   * 
   */

  const isUserExist = await User.findById(userId);

  if(!isUserExist){
    throw new AppError(httpStatusCodes.NOT_FOUND, "User Not Found");
  }

  if(payload.role){
    if(decodedToken.role === ERole.USER || decodedToken.role === ERole.GUIDE){
      throw new AppError(httpStatusCodes.FORBIDDEN, "You are not authorized.");
    }

    if(payload.role === ERole.SUPER_ADMIN && decodedToken.role === ERole.ADMIN){
      throw new AppError(httpStatusCodes.FORBIDDEN, "You are not authorized.");
    }
  }

  if(payload.isActive || payload.isDeleted || payload.isVerified){
    if(decodedToken.role === ERole.USER || decodedToken.role === ERole.GUIDE){
      throw new AppError(httpStatusCodes.FORBIDDEN, "You are not authorized.");
    }
  }

  if(payload.password){
    payload.password = await bcryptjs.hash(payload.password, Number(envVars.BCRYPT_SALT_ROUND));
  }

  const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, {new: true, runValidators: true})

  return newUpdatedUser;
 
}

const getAllUsers = async() =>{
  const users = await User.find();
  const totalUsers = await User.countDocuments();

  return {
    data: users,
    meta: {
      total: totalUsers
    }
  };
}

export const UserServices = {
  createUser,
  updateUser,
  getAllUsers
};
