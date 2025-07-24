import { NextFunction, Request, Response, Router } from "express";
import { UserControllers } from "./user.controller";
import z from "zod";

const router = Router();

router.post("/register", 

  async(req: Request, res: Response, next: NextFunction) =>{
    const createUserZodSchema = z.object({
      name: z
        .string({message: "Name must be string"})
        .min(2, {message: "Name is too short. It must have minimum 2 characters."})
        .max(50, {message: "Name is too long. It must have maximum 50 characters."}),
      email: z
        .email(),
      password: z
        .string({message: "Password must be string"})
        .min(8, {message: "Password must have at least 8 characters."})
        .regex(/^(?=.*[A-Z])/, {message: "Password must have at least one uppercase letter"})
        .regex(/^(?=.*[@#$%!*])/, {message: "Password must have at least one special character"})
        .regex(/^(?=.*\d)/, {message: "Password must have at least one digit"}),
      phone: z
        .string({message: "Phone number must be string"})
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {message: "Phone number must be valid for Bangladesh.   Format: +8801XXXXXXXXX or 01XXXXXXXXX"})
        .optional(),
      address: z
        .string({message: "Address must be string"})
        .max(50, {message: "Address can not exceed 200 characters"})
        .optional()
    })

    req.body = createUserZodSchema.parseAsync(req.body);
  
    next();
  } 
 
, UserControllers.createUser);


router.get("/all-users", UserControllers.getAllUsers);

export const UserRoutes = router;