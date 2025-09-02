import { Router } from "express";
import { PaymentController } from "./payment.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { ERole } from "../user/user.interface";

const router = Router();

router.post("/init-payment/:bookingId", PaymentController.initPayment)
router.post("/success", PaymentController.successPayment)
router.post("/failed", PaymentController.failedPayment )
router.post("/cancelled", PaymentController.cancelledPayment )
router.get("/invoice/:paymentId", checkAuth(...Object.values(ERole)), PaymentController.getInvoiceDownloadUrl)

export const PaymentRoutes = router;