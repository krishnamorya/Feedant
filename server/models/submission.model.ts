import mongoose, { Schema, Document, Model } from "mongoose";
import { SUBMISSION_STATUSES, MEDIA_TYPES } from "../utils/constants.js";
import type { SubmissionStatus, MediaType } from "../utils/constants.js";

// ─── Interface ──────────────────────────────────────────────────────

export interface ISubmission extends Document {
    user: mongoose.Types.ObjectId;
    competition: mongoose.Types.ObjectId;
    registration: mongoose.Types.ObjectId;
    mediaUrl: string;
    mediaType: MediaType;
    caption?: string;
    submittedAt: Date;
    status: SubmissionStatus;

    createdAt: Date;
    updatedAt: Date;
}

// ─── Schema ─────────────────────────────────────────────────────────

const submissionSchema = new Schema<ISubmission>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        competition: {
            type: Schema.Types.ObjectId,
            ref: "Competition",
            required: true,
        },
        registration: {
            type: Schema.Types.ObjectId,
            ref: "Registration",
            required: true,
        },
        mediaUrl: {
            type: String,
            required: true,
        },
        mediaType: {
            type: String,
            enum: MEDIA_TYPES,
            required: true,
        },
        caption: {
            type: String,
            trim: true,
            maxlength: 500,
        },
        submittedAt: {
            type: Date,
            default: Date.now,
        },
        status: {
            type: String,
            enum: SUBMISSION_STATUSES,
            default: "pending_review",
        },
    },
    {
        timestamps: true,
    }
);

// ─── Indexes ────────────────────────────────────────────────────────

// One submission per user per competition
submissionSchema.index({ user: 1, competition: 1 }, { unique: true });
submissionSchema.index({ competition: 1, status: 1 });

// ─── Export ─────────────────────────────────────────────────────────

export const Submission: Model<ISubmission> = mongoose.model<ISubmission>(
    "Submission",
    submissionSchema
);
