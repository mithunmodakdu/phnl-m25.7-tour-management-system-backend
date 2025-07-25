import { NextFunction, Request, Response, Router } from "express";
import { UserControllers } from "./user.controller";
import { createUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middlewares/validateRequest";
import AppError from "../../errorHelpers/appError";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ERole } from "./user.interface";
import { verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";

const router = Router();

const checkAuth = (...AuthRoles: string[]) => async(req: Request, res: Response, next: NextFunction)=>{
  try {
    const accessToken = req.headers.authorization;

    if(!accessToken){
      throw new AppError(403, "No Access Token received.");
    }

    const verifiedAccessToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET);
   
    if((verifiedAccessToken as JwtPayload).role !== ERole.ADMIN){
      throw new AppError(403, "You are not permitted to view this route");
    }

    next();

  } catch (error) {
    next(error);
  }
} 

router.post("/register", validateRequest(createUserZodSchema), UserControllers.createUser);


router.get("/all-users", checkAuth("ADMIN", "SUPER_ADMIN"), UserControllers.getAllUsers);

export const UserRoutes = router;