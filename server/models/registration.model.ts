import mongoose, { Schema, Document, Model } from "mongoose";
import { PAYMENT_STATUSES } from "../utils/constants.js";
import type { PaymentStatus } from "../utils/constants.js";

// ─── Interface ──────────────────────────────────────────────────────

export interface IRegistration extends Document {
    user: mongoose.Types.ObjectId;
    competition: mongoose.Types.ObjectId;
    paymentStatus: PaymentStatus;
    paymentId?: string;
    orderId?: string;
    amountPaid: number;
    referralCodeUsed?: string;
    registeredAt: Date;

    createdAt: Date;
    updatedAt: Date;
}

// ─── Schema ─────────────────────────────────────────────────────────

const registrationSchema = new Schema<IRegistration>(
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
        paymentStatus: {
            type: String,
            enum: PAYMENT_STATUSES,
            default: "pending",
        },
        paymentId: {
            type: String,
        },
        orderId: {
            type: String,
        },
        amountPaid: {
            type: Number,
            required: true,
            min: 0,
        },
        referralCodeUsed: {
            type: String,
            default: null,
        },
        registeredAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

// ─── Indexes ────────────────────────────────────────────────────────

// Prevents double registration: a user can register only once per competition
registrationSchema.index({ user: 1, competition: 1 }, { unique: true });
registrationSchema.index({ competition: 1, paymentStatus: 1 });
registrationSchema.index({ orderId: 1 });

// ─── Export ─────────────────────────────────────────────────────────

export const Registration: Model<IRegistration> =
    mongoose.model<IRegistration>("Registration", registrationSchema);
