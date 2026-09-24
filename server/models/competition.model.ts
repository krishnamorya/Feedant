import mongoose, { Schema, Document, Model } from "mongoose";
import {
    CATEGORIES,
    COMPETITION_STATUSES,
    LANGUAGES,
    DEFAULT_CURRENCY,
    DEFAULT_REFERRAL_BONUS,
} from "../utils/constants.js";
import type { Category, CompetitionStatus } from "../utils/constants.js";

// ─── Sub-document Interfaces ────────────────────────────────────────

interface IJudge {
    name: string;
    title: string;
    experience: string;
    photoUrl: string;
    introVideoUrl?: string;
}

interface IJudgingParameter {
    name: string;
    weightage: number;
    description: string;
}

interface IReward {
    position: number;
    label: string;
    amount: number;
    icon?: string;
}

// ─── Main Interface ─────────────────────────────────────────────────

export interface ICompetition extends Document {
    title: string;
    slug: string;
    category: Category;
    tags: string[];
    certificateEnabled: boolean;

    // Pricing & Capacity
    prizePool: number;
    entryFee: number;
    currency: string;
    maxParticipants: number;

    // Judge
    judge: IJudge;

    // Important Dates
    registrationDeadline: Date;
    submissionStartDate: Date;
    submissionEndDate: Date;
    resultDate: Date;

    // Content
    about: string;
    judgingParameters: IJudgingParameter[];
    rules: string;

    // Rewards
    rewards: IReward[];

    // Referral
    referralBonusAmount: number;

    // Meta
    status: CompetitionStatus;
    languages: string[];
    disclaimer: string;
    createdBy: mongoose.Types.ObjectId;

    createdAt: Date;
    updatedAt: Date;
}

// ─── Schema ─────────────────────────────────────────────────────────

const judgeSchema = new Schema<IJudge>(
    {
        name: { type: String, required: true, trim: true },
        title: { type: String, required: true, trim: true },
        experience: { type: String, required: true, trim: true },
        photoUrl: { type: String, required: true },
        introVideoUrl: { type: String },
    },
    { _id: false }
);

const judgingParameterSchema = new Schema<IJudgingParameter>(
    {
        name: { type: String, required: true, trim: true },
        weightage: { type: Number, required: true, min: 0, max: 100 },
        description: { type: String, required: true, trim: true },
    },
    { _id: false }
);

const rewardSchema = new Schema<IReward>(
    {
        position: { type: Number, required: true, min: 1 },
        label: { type: String, required: true, trim: true },
        amount: { type: Number, required: true, min: 0 },
        icon: { type: String },
    },
    { _id: false }
);

const competitionSchema = new Schema<ICompetition>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        category: {
            type: String,
            required: true,
            enum: CATEGORIES,
        },
        tags: {
            type: [String],
            default: [],
        },
        certificateEnabled: {
            type: Boolean,
            default: false,
        },

        // Pricing & Capacity
        prizePool: {
            type: Number,
            required: true,
            min: 0,
        },
        entryFee: {
            type: Number,
            required: true,
            min: 0,
        },
        currency: {
            type: String,
            default: DEFAULT_CURRENCY,
        },
        maxParticipants: {
            type: Number,
            required: true,
            min: 1,
        },

        // Judge
        judge: {
            type: judgeSchema,
            required: true,
        },

        // Important Dates
        registrationDeadline: {
            type: Date,
            required: true,
        },
        submissionStartDate: {
            type: Date,
            required: true,
        },
        submissionEndDate: {
            type: Date,
            required: true,
        },
        resultDate: {
            type: Date,
            required: true,
        },

        // Content
        about: {
            type: String,
            required: true,
        },
        judgingParameters: {
            type: [judgingParameterSchema],
            default: [],
        },
        rules: {
            type: String,
            default: "",
        },

        // Rewards
        rewards: {
            type: [rewardSchema],
            required: true,
            validate: {
                validator: (v: IReward[]) => v.length > 0,
                message: "At least one reward position is required",
            },
        },

        // Referral
        referralBonusAmount: {
            type: Number,
            default: DEFAULT_REFERRAL_BONUS,
            min: 0,
        },

        // Meta
        status: {
            type: String,
            enum: COMPETITION_STATUSES,
            default: "draft",
            index: true,
        },
        languages: {
            type: [String],
            enum: LANGUAGES,
            default: ["en"],
        },
        disclaimer: {
            type: String,
            default: "",
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// ─── Indexes ────────────────────────────────────────────────────────

competitionSchema.index({ status: 1, category: 1 });
competitionSchema.index({ registrationDeadline: 1 });
competitionSchema.index({ createdAt: -1 });

// ─── Pre-save: auto-generate slug ───────────────────────────────────

competitionSchema.pre("validate", function () {
    if (this.isModified("title") && !this.isModified("slug")) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
    }
});

// ─── Export ─────────────────────────────────────────────────────────

export const Competition: Model<ICompetition> = mongoose.model<ICompetition>(
    "Competition",
    competitionSchema
);
