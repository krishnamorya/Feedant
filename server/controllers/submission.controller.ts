import { Request, Response } from "express";
import { Competition } from "../models/competition.model.js";
import { Registration } from "../models/registration.model.js";
import { Submission } from "../models/submission.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ─── POST /api/v1/competitions/:id/submissions ──────────────────────

export const createSubmission = asyncHandler(
    async (req: Request, res: Response) => {
        const { id: competitionId } = req.params;
        const userId = req.userId!;

        // 1. Validate competition exists
        const competition = await Competition.findById(competitionId);
        if (!competition) {
            throw new ApiError(404, "Competition not found");
        }

        // 2. Check submission window
        const now = new Date();
        if (now < competition.submissionStartDate) {
            throw new ApiError(
                400,
                `Submission window has not opened yet. Opens on ${competition.submissionStartDate.toISOString()}`
            );
        }
        if (now > competition.submissionEndDate) {
            throw new ApiError(400, "Submission window has closed");
        }

        // 3. Verify user has paid registration
        const registration = await Registration.findOne({
            user: userId,
            competition: competitionId,
            paymentStatus: "completed",
        });

        if (!registration) {
            throw new ApiError(
                403,
                "You must register and complete payment before submitting"
            );
        }

        // 4. Check if already submitted
        const existingSubmission = await Submission.findOne({
            user: userId,
            competition: competitionId,
        });

        if (existingSubmission) {
            throw new ApiError(
                409,
                "You have already submitted. Only one submission per participant is allowed."
            );
        }

        // 5. Create submission
        const submission = await Submission.create({
            user: userId,
            competition: competitionId,
            registration: registration._id,
            mediaUrl: req.body.mediaUrl,
            mediaType: req.body.mediaType,
            caption: req.body.caption,
        });

        res.status(201).json(
            new ApiResponse(201, submission, "Submission uploaded successfully")
        );
    }
);

// ─── GET /api/v1/competitions/:id/submissions (Admin/Judge) ─────────

export const listSubmissions = asyncHandler(
    async (req: Request, res: Response) => {
        const { id: competitionId } = req.params;

        const competition = await Competition.findById(competitionId);
        if (!competition) {
            throw new ApiError(404, "Competition not found");
        }

        const { status } = req.query;
        const filter: Record<string, unknown> = { competition: competitionId };
        if (status) filter.status = status;

        const submissions = await Submission.find(filter)
            .populate("user", "name email avatarUrl")
            .sort({ submittedAt: -1 })
            .lean();

        res.status(200).json(
            new ApiResponse(200, {
                submissions,
                total: submissions.length,
            })
        );
    }
);

// ─── GET /api/v1/competitions/:id/submissions/mine ──────────────────

export const getMySubmission = asyncHandler(
    async (req: Request, res: Response) => {
        const { id: competitionId } = req.params;
        const userId = req.userId!;

        const submission = await Submission.findOne({
            user: userId,
            competition: competitionId,
        }).lean();

        if (!submission) {
            throw new ApiError(404, "No submission found for this competition");
        }

        res.status(200).json(
            new ApiResponse(200, submission, "Your submission")
        );
    }
);
