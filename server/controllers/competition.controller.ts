import { Request, Response } from "express";
import { Competition } from "../models/competition.model.js";
import { Registration } from "../models/registration.model.js";
import { Submission } from "../models/submission.model.js";
import { Winner } from "../models/winner.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ─── GET /api/v1/competitions ───────────────────────────────────────

export const listCompetitions = asyncHandler(
    async (req: Request, res: Response) => {
        const {
            page = 1,
            limit = 10,
            category,
            status,
            search,
            sortBy = "createdAt",
            sortOrder = "desc",
        } = req.query as Record<string, string>;

        const pageNum = Math.max(1, parseInt(page, 10) || 1);
        const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
        const skip = (pageNum - 1) * limitNum;

        // Build filter
        const filter: Record<string, unknown> = {};
        if (category) filter.category = category;
        if (status) filter.status = status;
        if (search) {
            filter.title = { $regex: search, $options: "i" };
        }

        // Build sort
        const sort: Record<string, 1 | -1> = {
            [sortBy as string]: sortOrder === "asc" ? 1 : -1,
        };

        const [competitions, total] = await Promise.all([
            Competition.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limitNum)
                .select("-judgingParameters -rules -about -disclaimer")
                .lean(),
            Competition.countDocuments(filter),
        ]);

        // Attach booked counts
        const competitionIds = competitions.map((c) => c._id);
        const registrationCounts = await Registration.aggregate([
            {
                $match: {
                    competition: { $in: competitionIds },
                    paymentStatus: "completed",
                },
            },
            { $group: { _id: "$competition", count: { $sum: 1 } } },
        ]);

        const countMap = new Map(
            registrationCounts.map((r) => [r._id.toString(), r.count])
        );

        const enriched = competitions.map((comp) => ({
            ...comp,
            bookedCount: countMap.get(comp._id.toString()) || 0,
            spotsLeft:
                comp.maxParticipants -
                (countMap.get(comp._id.toString()) || 0),
        }));

        res.status(200).json(
            new ApiResponse(200, {
                competitions: enriched,
                pagination: {
                    page: pageNum,
                    limit: limitNum,
                    total,
                    totalPages: Math.ceil(total / limitNum),
                },
            })
        );
    }
);

// ─── GET /api/v1/competitions/:slug ─────────────────────────────────

export const getCompetitionBySlug = asyncHandler(
    async (req: Request, res: Response) => {
        const { slug } = req.params;

        const competition = await Competition.findOne({ slug }).lean();

        if (!competition) {
            throw new ApiError(404, "Competition not found");
        }

        // Get booked count
        const bookedCount = await Registration.countDocuments({
            competition: competition._id,
            paymentStatus: "completed",
        });

        const spotsLeft = competition.maxParticipants - bookedCount;

        // Get previous winners (from past competitions in the same category, or this competition if results declared)
        const previousWinners = await Winner.find({
            competition: competition._id,
        })
            .populate("user", "name avatarUrl")
            .sort({ position: 1 })
            .lean();

        // Build response
        const responseData: Record<string, unknown> = {
            competition,
            bookedCount,
            spotsLeft,
            registrationClosesIn: competition.registrationDeadline,
            previousWinners,
        };

        // If user is authenticated, add personalized data
        if (req.userId) {
            const registration = await Registration.findOne({
                user: req.userId,
                competition: competition._id,
                paymentStatus: "completed",
            }).lean();

            const submission = await Submission.findOne({
                user: req.userId,
                competition: competition._id,
            }).lean();

            responseData.isRegistered = !!registration;
            responseData.hasSubmitted = !!submission;

            // Generate referral link if registered
            if (registration) {
                // In production, fetch from User model
                responseData.referralLink = `https://feedants.com/r/${req.userId}`;
            }
        }

        res.status(200).json(
            new ApiResponse(200, responseData, "Competition details fetched")
        );
    }
);

// ─── POST /api/v1/competitions ──────────────────────────────────────

export const createCompetition = asyncHandler(
    async (req: Request, res: Response) => {
        const data = req.body;

        // Attach the creator
        data.createdBy = req.userId;

        // Auto-generate slug from title if not provided
        if (!data.slug) {
            data.slug = data.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "");
        }

        // Check slug uniqueness
        const existing = await Competition.findOne({ slug: data.slug }).lean();
        if (existing) {
            throw new ApiError(
                409,
                `Competition with slug '${data.slug}' already exists`
            );
        }

        const competition = await Competition.create(data);

        res.status(201).json(
            new ApiResponse(201, competition, "Competition created successfully")
        );
    }
);

// ─── PUT /api/v1/competitions/:id ───────────────────────────────────

export const updateCompetition = asyncHandler(
    async (req: Request, res: Response) => {
        const { id } = req.params;

        const competition = await Competition.findById(id);
        if (!competition) {
            throw new ApiError(404, "Competition not found");
        }

        // Prevent editing if results are already declared
        if (competition.status === "results_declared" || competition.status === "closed") {
            throw new ApiError(
                400,
                "Cannot update a competition that has results declared or is closed"
            );
        }

        // Prevent reducing maxParticipants below current registrations
        if (req.body.maxParticipants !== undefined) {
            const currentRegistrations = await Registration.countDocuments({
                competition: id,
                paymentStatus: "completed",
            });

            if (req.body.maxParticipants < currentRegistrations) {
                throw new ApiError(
                    400,
                    `Cannot reduce max participants below current registration count (${currentRegistrations})`
                );
            }
        }

        const updated = await Competition.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json(
            new ApiResponse(200, updated, "Competition updated successfully")
        );
    }
);

// ─── DELETE /api/v1/competitions/:id ────────────────────────────────

export const deleteCompetition = asyncHandler(
    async (req: Request, res: Response) => {
        const { id } = req.params;

        const competition = await Competition.findById(id);
        if (!competition) {
            throw new ApiError(404, "Competition not found");
        }

        // Check if there are paid registrations
        const paidRegistrations = await Registration.countDocuments({
            competition: id,
            paymentStatus: "completed",
        });

        if (paidRegistrations > 0) {
            throw new ApiError(
                400,
                `Cannot delete competition with ${paidRegistrations} paid registration(s). Set status to 'closed' instead.`
            );
        }

        // Soft delete: set status to closed
        competition.status = "closed";
        await competition.save();

        res.status(200).json(
            new ApiResponse(200, null, "Competition closed successfully")
        );
    }
);
