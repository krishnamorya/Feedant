import { Request, Response } from "express";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ─── GET /api/v1/referral/link ──────────────────────────────────────

export const getReferralLink = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req.userId!;

        const user = await User.findById(userId).select("referralCode name");
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const baseUrl = process.env.FRONTEND_URL || "https://feedants.com";
        const referralLink = `${baseUrl}/r/${user.referralCode}`;

        res.status(200).json(
            new ApiResponse(200, {
                referralCode: user.referralCode,
                referralLink,
                userName: user.name,
            })
        );
    }
);

// ─── POST /api/v1/referral/apply ────────────────────────────────────

export const applyReferralCode = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req.userId!;
        const { referralCode } = req.body;

        if (!referralCode) {
            throw new ApiError(400, "Referral code is required");
        }

        // 1. Find the referrer
        const referrer = await User.findOne({ referralCode });
        if (!referrer) {
            throw new ApiError(404, "Invalid referral code");
        }

        // 2. Prevent self-referral
        if (referrer._id.toString() === userId) {
            throw new ApiError(400, "You cannot use your own referral code");
        }

        // 3. Check if user already has a referrer
        const currentUser = await User.findById(userId);
        if (!currentUser) {
            throw new ApiError(404, "User not found");
        }

        if (currentUser.referredBy) {
            throw new ApiError(400, "You have already used a referral code");
        }

        // 4. Link referral
        currentUser.referredBy = referrer._id as any;
        await currentUser.save();

        res.status(200).json(
            new ApiResponse(200, {
                referredBy: referrer.name,
            }, "Referral code applied successfully")
        );
    }
);
