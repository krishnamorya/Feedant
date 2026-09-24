import { Router } from "express";
import {
    listCompetitions,
    getCompetitionBySlug,
    createCompetition,
    updateCompetition,
    deleteCompetition,
} from "../controllers/competition.controller.js";
import { validate } from "../middleware/validate.js";
import { authenticate, authorize, optionalAuth } from "../middleware/auth.js";
import {
    createCompetitionSchema,
    updateCompetitionSchema,
    competitionQuerySchema,
} from "../validators/competition.validator.js";

const router = Router();

// Public routes
router.get(
    "/",
    validate(competitionQuerySchema, "query"),
    listCompetitions
);

router.get(
    "/:slug",
    optionalAuth,
    getCompetitionBySlug
);

// Admin routes
router.post(
    "/",
    authenticate,
    authorize("admin"),
    validate(createCompetitionSchema),
    createCompetition
);

router.put(
    "/:id",
    authenticate,
    authorize("admin"),
    validate(updateCompetitionSchema),
    updateCompetition
);

router.delete(
    "/:id",
    authenticate,
    authorize("admin"),
    deleteCompetition
);

export default router;
