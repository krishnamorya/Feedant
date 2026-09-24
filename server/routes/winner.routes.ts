import { Router } from "express";
import {
    declareWinners,
    getWinners,
} from "../controllers/winner.controller.js";
import { validate } from "../middleware/validate.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { declareWinnersSchema } from "../validators/winner.validator.js";

const router = Router({ mergeParams: true });

// Public route
router.get("/", getWinners);

// Admin route
router.post(
    "/",
    authenticate,
    authorize("admin"),
    validate(declareWinnersSchema),
    declareWinners
);

export default router;
