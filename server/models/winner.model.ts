import mongoose, { Schema, Document, Model } from "mongoose";

// ─── Interface ──────────────────────────────────────────────────────

export interface IWinner extends Document {
    competition: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    position: number;
    prizeAmount: number;
    certificateUrl?: string;

    createdAt: Date;
    updatedAt: Date;
}

// ─── Schema ─────────────────────────────────────────────────────────

const winnerSchema = new Schema<IWinner>(
    {
        competition: {
            type: Schema.Types.ObjectId,
            ref: "Competition",
            required: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        position: {
            type: Number,
            required: true,
            min: 1,
        },
        prizeAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        certificateUrl: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

// ─── Indexes ────────────────────────────────────────────────────────

// Each position can only be awarded once per competition
winnerSchema.index({ competition: 1, position: 1 }, { unique: true });
// A user can only win once per competition
winnerSchema.index({ competition: 1, user: 1 }, { unique: true });

// ─── Export ─────────────────────────────────────────────────────────

export const Winner: Model<IWinner> = mongoose.model<IWinner>(
    "Winner",
    winnerSchema
);
