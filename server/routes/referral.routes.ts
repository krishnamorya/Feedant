import { Router } from "express";
import {
    getReferralLink,
    applyReferralCode,
} from "../controllers/referral.controller.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

// All referral routes require authentication
router.get("/link", authenticate, getReferralLink);
router.post("/apply", authenticate, applyReferralCode);

export default router;
