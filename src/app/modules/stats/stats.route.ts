import express from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { StatsController } from "./stats.controller";
import { ERole } from "../user/user.interface";

const router = express.Router();

router.get(
    "/booking",
    checkAuth(ERole.ADMIN, ERole.SUPER_ADMIN),
    StatsController.getBookingStats
);
router.get(
    "/payment",
    checkAuth(ERole.ADMIN, ERole.SUPER_ADMIN),
    StatsController.getPaymentStats
);
router.get(
    "/user",
    checkAuth(ERole.ADMIN, ERole.SUPER_ADMIN),
    StatsController.getUserStats
);
router.get(
    "/tour",
    checkAuth(ERole.ADMIN, ERole.SUPER_ADMIN),
    StatsController.getTourStats
);

export const StatsRoutes = router;