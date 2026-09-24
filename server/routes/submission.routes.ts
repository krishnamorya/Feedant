import { Router } from "express";
import {
    createSubmission,
    listSubmissions,
    getMySubmission,
} from "../controllers/submission.controller.js";
import { validate } from "../middleware/validate.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { createSubmissionSchema } from "../validators/submission.validator.js";

const router = Router({ mergeParams: true });

// User routes
router.post(
    "/",
    authenticate,
    validate(createSubmissionSchema),
    createSubmission
);

router.get(
    "/mine",
    authenticate,
    getMySubmission
);

// Admin/Judge route
router.get(
    "/",
    authenticate,
    authorize("admin", "judge"),
    listSubmissions
);

export default router;
