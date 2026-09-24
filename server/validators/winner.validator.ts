import { z } from "zod";

// ─── Single Winner Entry ────────────────────────────────────────────

const winnerEntrySchema = z.object({
    userId: z.string().min(1, "User ID is required"),
    position: z.number().int().min(1, "Position must be at least 1"),
    prizeAmount: z.number().min(0, "Prize amount must be non-negative"),
    certificateUrl: z.string().url("Certificate URL must be valid").optional(),
});

// ─── Declare Winners (batch) ────────────────────────────────────────

export const declareWinnersSchema = z
    .object({
        winners: z
            .array(winnerEntrySchema)
            .min(1, "At least one winner is required"),
    })
    .refine(
        (data) => {
            const positions = data.winners.map((w) => w.position);
            return new Set(positions).size === positions.length;
        },
        {
            message: "Winner positions must be unique",
            path: ["winners"],
        }
    )
    .refine(
        (data) => {
            const userIds = data.winners.map((w) => w.userId);
            return new Set(userIds).size === userIds.length;
        },
        {
            message: "A user cannot win multiple positions",
            path: ["winners"],
        }
    );
