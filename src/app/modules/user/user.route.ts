import { Router } from "express";
import { UserControllers } from "./user.controller";
import { createUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middlewares/validateRequest";
import { checkAuth } from "../../middlewares/checkAuth";
import { ERole } from "./user.interface";

const router = Router();

router.post("/register",
   validateRequest(createUserZodSchema), 
   UserControllers.createUser
  );

router.get("/all-users", checkAuth(ERole.ADMIN, ERole.SUPER_ADMIN), UserControllers.getAllUsers);

router.get("/me", checkAuth(...Object.values(ERole)), UserControllers.getMe);

router.patch("/:id", checkAuth(ERole.ADMIN, ERole.SUPER_ADMIN), UserControllers.updateUser)

export const UserRoutes = router;