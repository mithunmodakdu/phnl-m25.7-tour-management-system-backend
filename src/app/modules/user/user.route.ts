import { NextFunction, Request, Response, Router } from "express";
import { UserControllers } from "./user.controller";
import { createUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middlewares/validateRequest";
import AppError from "../../errorHelpers/appError";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ERole } from "./user.interface";

const router = Router();

router.post("/register", validateRequest(createUserZodSchema), UserControllers.createUser);


router.get("/all-users", async(req: Request, res: Response, next: NextFunction)=>{
  try {
    const accessToken = req.headers.authorization;

    if(!accessToken){
      throw new AppError(403, "No Access Token received.");
    }

    const verifiedAccessToken = jwt.verify(accessToken, "myWebsiteSecret");
    console.log(verifiedAccessToken);
   
    if((verifiedAccessToken as JwtPayload).role !== ERole.ADMIN || ERole.SUPER_ADMIN){
      throw new AppError(403, "You are not permitted to view this route");
    }

    next();

  } catch (error) {
    next(error);
  }
} , UserControllers.getAllUsers);

export const UserRoutes = router;