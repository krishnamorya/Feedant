import { Router } from "express";
import {
    registerForCompetition,
    verifyPayment,
    listRegistrations,
} from "../controllers/registration.controller.js";
import { validate } from "../middleware/validate.js";
import { authenticate, authorize } from "../middleware/auth.js";
import {
    registerSchema,
    verifyPaymentSchema,
} from "../validators/registration.validator.js";

const router = Router({ mergeParams: true });

// User routes
router.post(
    "/",
    authenticate,
    validate(registerSchema),
    registerForCompetition
);

router.post(
    "/verify",
    authenticate,
    validate(verifyPaymentSchema),
    verifyPayment
);

// Admin route
router.get(
    "/",
    authenticate,
    authorize("admin"),
    listRegistrations
);

export default router;
