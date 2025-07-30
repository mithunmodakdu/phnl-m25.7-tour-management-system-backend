import { NextFunction, Request, Response, Router } from "express";
import { AuthControllers } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { ERole } from "../user/user.interface";
import passport from "passport";

const router = Router();

router.post("/login", AuthControllers.credentialsLogin);
router.post("/refresh-token", AuthControllers.getNewAccessToken);
router.post("/logout", AuthControllers.logout);
<<<<<<< Updated upstream
router.post("/reset-password", checkAuth(...Object.values(ERole))  , AuthControllers.resetPassword);

=======
router.post("/reset-password", checkAuth(...Object.values(ERole)) , AuthControllers.resetPassword);
>>>>>>> Stashed changes
router.get("/google", async(req: Request, res: Response, next: NextFunction) =>{
  const redirect = req.query.redirect || "/";
  passport.authenticate("google", {scope: ["profile", "email"], state: redirect as string})(req, res, next)
});

router.get("/google/callback", passport.authenticate("google", {failureRedirect: "/login"}) , AuthControllers.googleCallbackController)


export const AuthRoutes = router;