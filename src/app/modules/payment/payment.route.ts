import { Router } from "express";
import { PaymentController } from "./payment.controller";

const router = Router();

router.post("/init-payment/:bookingId", PaymentController.initPayment)
router.post("/success", PaymentController.successPayment)
router.post("/failed", PaymentController.failedPayment )
router.post("/cancelled", PaymentController.cancelledPayment )

export const PaymentRoutes = router;