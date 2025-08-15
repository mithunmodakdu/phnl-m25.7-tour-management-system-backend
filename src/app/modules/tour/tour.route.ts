import { Router } from "express";
import { TourControllers } from "./tour.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { ERole } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { createTourTypeZodSchema, createTourZodSchema, updateTourTypeZodSchema } from "./tour.validation";


const router = Router();

// :::: Tour Type ::::
router.post("/create-tour-type", 
  checkAuth(ERole.SUPER_ADMIN, ERole.ADMIN),
  validateRequest(createTourTypeZodSchema),
  TourControllers.createTourType
)
router.get("/tour-types", TourControllers.getAllTourTypes);
router.patch("/tour-types/:id",
  checkAuth(ERole.SUPER_ADMIN, ERole.ADMIN),
  validateRequest(updateTourTypeZodSchema),
  TourControllers.updateTourType
)
router.delete("/tour-types/:id", 
  checkAuth(ERole.SUPER_ADMIN, ERole.ADMIN),
  TourControllers.deleteTourType
)


// :::: Tour ::::
router.post("/create", 
  checkAuth(ERole.SUPER_ADMIN, ERole.ADMIN),
  validateRequest(createTourZodSchema),
  TourControllers.createTour
);
router.get("/", TourControllers.getAllTours);
router.patch("/:id", 
  checkAuth(ERole.SUPER_ADMIN, ERole.ADMIN),
  validateRequest(createTourZodSchema),
  TourControllers.updateTour
);
router.delete("/:id", 
  checkAuth(ERole.SUPER_ADMIN, ERole.ADMIN),
  TourControllers.deleteTour
);

export const TourRoutes = router;