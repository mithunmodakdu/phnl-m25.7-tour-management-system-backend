import { Router } from "express";
import { TourControllers } from "./tour.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { ERole } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { createTourTypeZodSchema, createTourZodSchema } from "./tour.validation";

const router = Router();

router.post("/create-tour-type", 
  checkAuth(ERole.SUPER_ADMIN, ERole.ADMIN),
  validateRequest(createTourTypeZodSchema),
  TourControllers.createTourType
)

router.post("/create", 
  checkAuth(ERole.SUPER_ADMIN, ERole.ADMIN),
  validateRequest(createTourZodSchema),
  TourControllers.createTour
)

export const TourRoutes = router;