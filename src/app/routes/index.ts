import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";

export const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes
  }
];

moduleRoutes.forEach((moduleRoute) =>{
  router.use(moduleRoute.path, moduleRoute.route);
})