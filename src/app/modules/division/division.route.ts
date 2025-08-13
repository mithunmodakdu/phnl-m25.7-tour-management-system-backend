import { Router } from "express";
import { DivisionControllers } from "./division.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { ERole } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { createDivisionZodSchema } from "./division.validation";

const router = Router();

router.post("/create", 
  checkAuth(ERole.SUPER_ADMIN, ERole.ADMIN),
  validateRequest(createDivisionZodSchema),
  DivisionControllers.createDivision
)

export const DivisionRoutes = router;