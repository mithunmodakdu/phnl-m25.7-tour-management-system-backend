import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/appError";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../modules/user/user.model";
import httpStatusCodes from "http-status-codes";
import { EIsActive } from "../modules/user/user.interface";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;

      if (!accessToken) {
        throw new AppError(403, "No Access Token received.");
      }

      const verifiedAccessToken = verifyToken(
        accessToken,
        envVars.JWT_ACCESS_SECRET
      ) as JwtPayload;

      const isUserExist = await User.findOne({
        email: verifiedAccessToken.email,
      });

      if (!isUserExist) {
        throw new AppError(httpStatusCodes.BAD_REQUEST, "User does not exist");
      }

      if (
        isUserExist.isActive === EIsActive.INACTIVE ||
        isUserExist.isActive === EIsActive.BLOCKED
      ) {
        throw new AppError(
          httpStatusCodes.BAD_REQUEST,
          `User is ${isUserExist.isActive}`
        );
      }

      if (isUserExist.isDeleted) {
        throw new AppError(httpStatusCodes.BAD_REQUEST, "User is deleted");
      }

      if (!authRoles.includes(verifiedAccessToken.role)) {
        throw new AppError(403, "You are not permitted to view this route");
      }

      req.user = verifiedAccessToken;

      next();
      
    } catch (error) {
      next(error);
    }
  };
