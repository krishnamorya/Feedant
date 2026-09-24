import { z } from "zod";

// ─── Register for Competition ───────────────────────────────────────

export const registerSchema = z.object({
    referralCode: z
        .string()
        .trim()
        .min(1, "Referral code cannot be empty")
        .optional(),
});

// ─── Verify Payment ─────────────────────────────────────────────────

export const verifyPaymentSchema = z.object({
    razorpayPaymentId: z
        .string()
        .trim()
        .min(1, "Razorpay payment ID is required"),
    razorpayOrderId: z
        .string()
        .trim()
        .min(1, "Razorpay order ID is required"),
    razorpaySignature: z
        .string()
        .trim()
        .min(1, "Razorpay signature is required"),
});
