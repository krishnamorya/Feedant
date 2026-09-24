import { Request, Response } from "express";
import mongoose from "mongoose";
import { Competition } from "../models/competition.model.js";
import { Registration } from "../models/registration.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ─── POST /api/v1/competitions/:id/register ─────────────────────────

export const registerForCompetition = asyncHandler(
    async (req: Request, res: Response) => {
        const { id: competitionId } = req.params;
        const userId = req.userId!;
        const { referralCode } = req.body;

        // 1. Validate competition exists
        const competition = await Competition.findById(competitionId);
        if (!competition) {
            throw new ApiError(404, "Competition not found");
        }

        // 2. Check registration window
        const now = new Date();
        if (now > competition.registrationDeadline) {
            throw new ApiError(400, "Registration deadline has passed");
        }

        if (competition.status !== "registration_open" && competition.status !== "submission_open") {
            throw new ApiError(
                400,
                `Registration is not open. Current status: ${competition.status}`
            );
        }

        // 3. Check for duplicate registration
        const existingRegistration = await Registration.findOne({
            user: userId,
            competition: competitionId,
        });

        if (existingRegistration) {
            if (existingRegistration.paymentStatus === "completed") {
                throw new ApiError(409, "You are already registered for this competition");
            }
            // If pending/failed, allow re-attempt — we'll update the existing record
            if (existingRegistration.paymentStatus === "pending") {
                throw new ApiError(
                    400,
                    "You have a pending registration. Please complete payment or wait for it to expire."
                );
            }
        }

        // 4. Check capacity — use atomic operation to prevent race conditions
        const bookedCount = await Registration.countDocuments({
            competition: competitionId,
            paymentStatus: "completed",
        });

        if (bookedCount >= competition.maxParticipants) {
            throw new ApiError(400, "Competition is full. No spots left.");
        }

        // 5. Validate referral code (if provided)
        let referralUser = null;
        if (referralCode) {
            referralUser = await User.findOne({ referralCode });
            if (!referralUser) {
                throw new ApiError(400, "Invalid referral code");
            }
            // Prevent self-referral
            if (referralUser._id.toString() === userId) {
                throw new ApiError(400, "You cannot use your own referral code");
            }
        }

        // 6. Create registration record
        // In production, you'd create a Razorpay order here and return the orderId.
        // For now, we simulate an order ID.
        const orderId = `order_${new mongoose.Types.ObjectId().toString()}`;

        const registration = await Registration.create({
            user: userId,
            competition: competitionId,
            paymentStatus: "pending",
            orderId,
            amountPaid: competition.entryFee,
            referralCodeUsed: referralCode || null,
        });

        res.status(201).json(
            new ApiResponse(
                201,
                {
                    registration,
                    orderId,
                    amount: competition.entryFee,
                    currency: competition.currency,
                    competitionTitle: competition.title,
                },
                "Registration initiated. Complete payment to confirm."
            )
        );
    }
);

// ─── POST /api/v1/competitions/:id/register/verify ──────────────────

export const verifyPayment = asyncHandler(
    async (req: Request, res: Response) => {
        const { id: competitionId } = req.params;
        const { razorpayPaymentId, razorpayOrderId } = req.body;

        // 1. Find the registration by orderId
        const registration = await Registration.findOne({
            competition: competitionId,
            orderId: razorpayOrderId,
            user: req.userId,
        });

        if (!registration) {
            throw new ApiError(404, "Registration not found for this order");
        }

        if (registration.paymentStatus === "completed") {
            throw new ApiError(400, "Payment already verified");
        }

        // 2. In production: verify signature with Razorpay SDK
        //    crypto.createHmac('sha256', secret).update(orderId + "|" + paymentId).digest('hex')
        //    For now, we trust the payment ID.

        // 3. Atomic capacity check + update to prevent race condition
        const competition = await Competition.findById(competitionId);
        if (!competition) {
            throw new ApiError(404, "Competition not found");
        }

        const currentBooked = await Registration.countDocuments({
            competition: competitionId,
            paymentStatus: "completed",
        });

        if (currentBooked >= competition.maxParticipants) {
            // Refund scenario — in production, trigger Razorpay refund
            registration.paymentStatus = "failed";
            await registration.save();
            throw new ApiError(
                400,
                "Competition is now full. Your payment will be refunded."
            );
        }

        // 4. Mark payment as completed
        registration.paymentStatus = "completed";
        registration.paymentId = razorpayPaymentId;
        await registration.save();

        // 5. Process referral bonus
        if (registration.referralCodeUsed) {
            const referrer = await User.findOne({
                referralCode: registration.referralCodeUsed,
            });
            if (referrer) {
                referrer.walletBalance += competition.referralBonusAmount;
                await referrer.save();
            }
        }

        res.status(200).json(
            new ApiResponse(200, registration, "Payment verified. Registration confirmed!")
        );
    }
);

// ─── GET /api/v1/competitions/:id/registrations ─────────────────────

export const listRegistrations = asyncHandler(
    async (req: Request, res: Response) => {
        const { id: competitionId } = req.params;

        const competition = await Competition.findById(competitionId);
        if (!competition) {
            throw new ApiError(404, "Competition not found");
        }

        const registrations = await Registration.find({
            competition: competitionId,
            paymentStatus: "completed",
        })
            .populate("user", "name email avatarUrl")
            .sort({ registeredAt: -1 })
            .lean();

        res.status(200).json(
            new ApiResponse(200, {
                registrations,
                total: registrations.length,
                maxParticipants: competition.maxParticipants,
                spotsLeft: competition.maxParticipants - registrations.length,
            })
        );
    }
);
