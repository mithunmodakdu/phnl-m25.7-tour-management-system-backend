import { Router } from "express";
import { DivisionControllers } from "./division.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { ERole } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { createDivisionZodSchema, updateDivisionZodSchema } from "./division.validation";

const router = Router();

router.post("/create", 
  checkAuth(ERole.SUPER_ADMIN, ERole.ADMIN),
  validateRequest(createDivisionZodSchema),
  DivisionControllers.createDivision
)
router.get("/", DivisionControllers.getAllDivisions);
router.get("/:slug", DivisionControllers.getSingleDivision);
router.patch("/:id", 
  checkAuth(ERole.SUPER_ADMIN, ERole.ADMIN),
  validateRequest(updateDivisionZodSchema),
  DivisionControllers.updateDivision
);

export const DivisionRoutes = router;