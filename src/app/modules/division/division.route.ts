import { Router } from "express";
import { DivisionControllers } from "./division.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { ERole } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { createDivisionZodSchema, updateDivisionZodSchema } from "./division.validation";
import { multerUpload } from "../../config/multer.config";

const router = Router();

router.post("/create", 
  checkAuth(ERole.SUPER_ADMIN, ERole.ADMIN),
  multerUpload.single("file"),
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
router.delete("/:id",
  checkAuth(ERole.SUPER_ADMIN, ERole.ADMIN),
  DivisionControllers.deleteDivision
);

export const DivisionRoutes = router;