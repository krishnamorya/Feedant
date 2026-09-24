import { Request, Response } from "express";
import { Competition } from "../models/competition.model.js";
import { Registration } from "../models/registration.model.js";
import { Winner } from "../models/winner.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ─── POST /api/v1/competitions/:id/winners ──────────────────────────

export const declareWinners = asyncHandler(
    async (req: Request, res: Response) => {
        const { id: competitionId } = req.params;
        const { winners } = req.body;

        // 1. Validate competition exists
        const competition = await Competition.findById(competitionId);
        if (!competition) {
            throw new ApiError(404, "Competition not found");
        }

        // 2. Check if submission window has closed
        const now = new Date();
        if (now < competition.submissionEndDate) {
            throw new ApiError(
                400,
                "Cannot declare winners before submission window closes"
            );
        }

        // 3. Check if winners already declared
        const existingWinners = await Winner.countDocuments({
            competition: competitionId,
        });
        if (existingWinners > 0) {
            throw new ApiError(
                409,
                "Winners have already been declared for this competition. Delete existing winners first."
            );
        }

        // 4. Validate all winner userIds are registered participants
        for (const entry of winners) {
            const registration = await Registration.findOne({
                user: entry.userId,
                competition: competitionId,
                paymentStatus: "completed",
            });

            if (!registration) {
                throw new ApiError(
                    400,
                    `User ${entry.userId} is not a registered participant of this competition`
                );
            }
        }

        // 5. Validate positions match competition rewards
        const maxRewardPosition = Math.max(
            ...competition.rewards.map((r) => r.position)
        );
        for (const entry of winners) {
            if (entry.position > maxRewardPosition) {
                throw new ApiError(
                    400,
                    `Position ${entry.position} exceeds the maximum reward position (${maxRewardPosition})`
                );
            }
        }

        // 6. Bulk create winners
        const winnerDocs = winners.map(
            (entry: {
                userId: string;
                position: number;
                prizeAmount: number;
                certificateUrl?: string;
            }) => ({
                competition: competitionId,
                user: entry.userId,
                position: entry.position,
                prizeAmount: entry.prizeAmount,
                certificateUrl: entry.certificateUrl,
            })
        );

        const createdWinners = await Winner.insertMany(winnerDocs);

        // 7. Update competition status
        competition.status = "results_declared";
        await competition.save();

        res.status(201).json(
            new ApiResponse(
                201,
                createdWinners,
                "Winners declared successfully"
            )
        );
    }
);

// ─── GET /api/v1/competitions/:id/winners ───────────────────────────

export const getWinners = asyncHandler(
    async (req: Request, res: Response) => {
        const { id: competitionId } = req.params;

        const competition = await Competition.findById(competitionId);
        if (!competition) {
            throw new ApiError(404, "Competition not found");
        }

        const winners = await Winner.find({ competition: competitionId })
            .populate("user", "name avatarUrl")
            .sort({ position: 1 })
            .lean();

        res.status(200).json(
            new ApiResponse(200, {
                winners,
                competitionTitle: competition.title,
            })
        );
    }
);
