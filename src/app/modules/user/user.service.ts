import AppError from "../../errorHelpers/appError";
import { ERole, IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";
import httpStatusCodes from "http-status-codes";
import bcryptjs from "bcryptjs";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { userSearchableFields } from "./user.constants";


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

  if(decodedToken.role === ERole.USER || decodedToken.role === ERole.GUIDE){
    if(userId !== decodedToken.userId){
      throw new AppError(httpStatusCodes.UNAUTHORIZED, "You are not authorized.")
    }
  }

  const isUserExist = await User.findById(userId);

  if(!isUserExist){
    throw new AppError(httpStatusCodes.NOT_FOUND, "User Not Found");
  }

  if(decodedToken.role === ERole.ADMIN && isUserExist.role === ERole.SUPER_ADMIN){
    throw new AppError(httpStatusCodes.UNAUTHORIZED, "You are not authorized.")
  }

  if(payload.role){
    if(decodedToken.role === ERole.USER || decodedToken.role === ERole.GUIDE){
      throw new AppError(httpStatusCodes.FORBIDDEN, "You are not authorized.");
    }

    // if(payload.role === ERole.SUPER_ADMIN && decodedToken.role === ERole.ADMIN){
    //   throw new AppError(httpStatusCodes.FORBIDDEN, "You are not authorized.");
    // }
  }

  if(payload.isActive || payload.isDeleted || payload.isVerified){
    if(decodedToken.role === ERole.USER || decodedToken.role === ERole.GUIDE){
      throw new AppError(httpStatusCodes.FORBIDDEN, "You are not authorized.");
    }
  }

  const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, {new: true, runValidators: true})

  return newUpdatedUser;
 
}

const getAllUsers = async(query: Record<string, string>) =>{

  const queryBuilder = new QueryBuilder(User.find(), query);

  const users = queryBuilder.filter().search(userSearchableFields).sort().fields().paginate();

  const [data, meta] = await Promise.all([
    users.build(),
    queryBuilder.getMeta()
  ])


  return {
    data,
    meta
    
  };
}

const getMe = async(userId: string) =>{

 const user = await User.findById(userId).select("-password");

  return {
    data: user,       
  };
}

export const UserServices = {
  createUser,
  updateUser,
  getAllUsers,
  getMe
};
