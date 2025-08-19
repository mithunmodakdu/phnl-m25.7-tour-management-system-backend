import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { ERole } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { createBookingZodSchema, updateBookingStatusZodSchema } from "./booking.validation";
import { BookingController } from "./booking.controller";

const router = Router();

// api/v1/booking
router.post("/",
    checkAuth(...Object.values(ERole)),
    validateRequest(createBookingZodSchema),
    BookingController.createBooking
);

// api/v1/booking
router.get("/",
    checkAuth(ERole.ADMIN, ERole.SUPER_ADMIN),
    BookingController.getAllBookings
);

// api/v1/booking/my-bookings
router.get("/my-bookings",
    checkAuth(...Object.values(ERole)),
    BookingController.getUserBookings
);

// api/v1/booking/bookingId
router.get("/:bookingId",
    checkAuth(...Object.values(ERole)),
    BookingController.getSingleBooking
);

// api/v1/booking/bookingId/status
router.patch("/:bookingId/status",
    checkAuth(...Object.values(ERole)),
    validateRequest(updateBookingStatusZodSchema),
    BookingController.updateBookingStatus
);

export const BookingRoutes = router;