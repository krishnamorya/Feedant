import { z } from "zod";
import { CATEGORIES, COMPETITION_STATUSES, LANGUAGES } from "../utils/constants.js";

// ─── Sub-schemas ────────────────────────────────────────────────────

const judgeSchema = z.object({
    name: z.string().trim().min(1, "Judge name is required"),
    title: z.string().trim().min(1, "Judge title is required"),
    experience: z.string().trim().min(1, "Judge experience is required"),
    photoUrl: z.string().url("Judge photo must be a valid URL"),
    introVideoUrl: z.string().url("Intro video must be a valid URL").optional(),
});

const judgingParameterSchema = z.object({
    name: z.string().trim().min(1, "Parameter name is required"),
    weightage: z
        .number()
        .min(0, "Weightage must be at least 0")
        .max(100, "Weightage must be at most 100"),
    description: z.string().trim().min(1, "Parameter description is required"),
});

const rewardSchema = z.object({
    position: z.number().int().min(1, "Position must be at least 1"),
    label: z.string().trim().min(1, "Reward label is required"),
    amount: z.number().min(0, "Reward amount must be non-negative"),
    icon: z.string().optional(),
});

// ─── Create Competition Schema ──────────────────────────────────────

export const createCompetitionSchema = z
    .object({
        title: z.string().trim().min(1, "Title is required").max(200),
        slug: z
            .string()
            .trim()
            .min(1)
            .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens")
            .optional(),
        category: z.enum(CATEGORIES, {
            errorMap: () => ({ message: `Category must be one of: ${CATEGORIES.join(", ")}` }),
        }),
        tags: z.array(z.string().trim()).default([]),
        certificateEnabled: z.boolean().default(false),

        // Pricing & Capacity
        prizePool: z.number().min(0, "Prize pool must be non-negative"),
        entryFee: z.number().min(0, "Entry fee must be non-negative"),
        currency: z.string().default("INR"),
        maxParticipants: z.number().int().min(1, "At least 1 participant required"),

        // Judge
        judge: judgeSchema,

        // Important Dates
        registrationDeadline: z.coerce.date(),
        submissionStartDate: z.coerce.date(),
        submissionEndDate: z.coerce.date(),
        resultDate: z.coerce.date(),

        // Content
        about: z.string().min(1, "About section is required"),
        judgingParameters: z.array(judgingParameterSchema).default([]),
        rules: z.string().default(""),

        // Rewards
        rewards: z.array(rewardSchema).min(1, "At least one reward is required"),

        // Referral
        referralBonusAmount: z.number().min(0).default(10),

        // Meta
        status: z.enum(COMPETITION_STATUSES).default("draft"),
        languages: z.array(z.enum(LANGUAGES)).default(["en"]),
        disclaimer: z.string().default(""),
    })

    // ─── Cross-field Business Rule Validations ──────────────────────

    .refine(
        (data) => data.registrationDeadline >= data.submissionStartDate,
        {
            message: "Registration deadline must be on or after submission start date",
            path: ["registrationDeadline"],
        }
    )
    .refine(
        (data) => data.submissionStartDate < data.submissionEndDate,
        {
            message: "Submission start date must be before submission end date",
            path: ["submissionStartDate"],
        }
    )
    .refine(
        (data) => data.submissionEndDate < data.resultDate,
        {
            message: "Submission end date must be before result date",
            path: ["submissionEndDate"],
        }
    )
    .refine(
        (data) => {
            const totalRewards = data.rewards.reduce((sum, r) => sum + r.amount, 0);
            return data.prizePool >= totalRewards;
        },
        {
            message: "Prize pool must be greater than or equal to the sum of all reward amounts",
            path: ["prizePool"],
        }
    )
    .refine(
        (data) => {
            const positions = data.rewards.map((r) => r.position);
            const unique = new Set(positions);
            return positions.length === unique.size;
        },
        {
            message: "Reward positions must be unique",
            path: ["rewards"],
        }
    )
    .refine(
        (data) => {
            const positions = data.rewards.map((r) => r.position).sort((a, b) => a - b);
            return positions.every((pos, idx) => pos === idx + 1);
        },
        {
            message: "Reward positions must be sequential starting from 1",
            path: ["rewards"],
        }
    );

// ─── Update Competition Schema ──────────────────────────────────────

export const updateCompetitionSchema = z
    .object({
        title: z.string().trim().min(1).max(200).optional(),
        category: z.enum(CATEGORIES).optional(),
        tags: z.array(z.string().trim()).optional(),
        certificateEnabled: z.boolean().optional(),

        prizePool: z.number().min(0).optional(),
        entryFee: z.number().min(0).optional(),
        maxParticipants: z.number().int().min(1).optional(),

        judge: judgeSchema.partial().optional(),

        registrationDeadline: z.coerce.date().optional(),
        submissionStartDate: z.coerce.date().optional(),
        submissionEndDate: z.coerce.date().optional(),
        resultDate: z.coerce.date().optional(),

        about: z.string().optional(),
        judgingParameters: z.array(judgingParameterSchema).optional(),
        rules: z.string().optional(),
        rewards: z.array(rewardSchema).optional(),

        referralBonusAmount: z.number().min(0).optional(),
        status: z.enum(COMPETITION_STATUSES).optional(),
        languages: z.array(z.enum(LANGUAGES)).optional(),
        disclaimer: z.string().optional(),
    })
    .refine(
        (data) => {
            if (data.registrationDeadline && data.submissionStartDate) {
                return data.registrationDeadline >= data.submissionStartDate;
            }
            return true;
        },
        {
            message: "Registration deadline must be on or after submission start date",
            path: ["registrationDeadline"],
        }
    )
    .refine(
        (data) => {
            if (data.submissionStartDate && data.submissionEndDate) {
                return data.submissionStartDate < data.submissionEndDate;
            }
            return true;
        },
        {
            message: "Submission start date must be before submission end date",
            path: ["submissionStartDate"],
        }
    )
    .refine(
        (data) => {
            if (data.submissionEndDate && data.resultDate) {
                return data.submissionEndDate < data.resultDate;
            }
            return true;
        },
        {
            message: "Submission end date must be before result date",
            path: ["submissionEndDate"],
        }
    );

// ─── Query Params Schema ───────────────────────────────────────────

export const competitionQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
    category: z.enum(CATEGORIES).optional(),
    status: z.enum(COMPETITION_STATUSES).optional(),
    search: z.string().trim().optional(),
    sortBy: z.enum(["createdAt", "registrationDeadline", "prizePool", "entryFee"]).default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
});
