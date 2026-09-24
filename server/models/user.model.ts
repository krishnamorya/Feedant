import mongoose, { Schema, Document, Model } from "mongoose";
import crypto from "crypto";
import { USER_ROLES } from "../utils/constants.js";
import type { UserRole } from "../utils/constants.js";

// ─── Interface ──────────────────────────────────────────────────────

export interface IUser extends Document {
    name: string;
    email: string;
    phone?: string;
    passwordHash: string;
    avatarUrl?: string;
    referralCode: string;
    referredBy?: mongoose.Types.ObjectId;
    walletBalance: number;
    role: UserRole;

    createdAt: Date;
    updatedAt: Date;
}

// ─── Schema ─────────────────────────────────────────────────────────

const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        phone: {
            type: String,
            unique: true,
            sparse: true, // allows multiple nulls
            trim: true,
        },
        passwordHash: {
            type: String,
            required: true,
            select: false, // never returned by default
        },
        avatarUrl: {
            type: String,
        },
        referralCode: {
            type: String,
            unique: true,
            index: true,
        },
        referredBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        walletBalance: {
            type: Number,
            default: 0,
            min: 0,
        },
        role: {
            type: String,
            enum: USER_ROLES,
            default: "user",
        },
    },
    {
        timestamps: true,
    }
);

// ─── Pre-save: auto-generate referral code ──────────────────────────

userSchema.pre("validate", function () {
    if (!this.referralCode) {
        // Generate a unique 8-character referral code
        this.referralCode = crypto.randomBytes(4).toString("hex");
    }
});

// ─── Indexes ────────────────────────────────────────────────────────

userSchema.index({ email: 1 });
userSchema.index({ referralCode: 1 });

// ─── Export ─────────────────────────────────────────────────────────

export const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
