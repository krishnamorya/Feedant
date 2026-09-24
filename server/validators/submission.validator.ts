import { z } from "zod";
import { MEDIA_TYPES } from "../utils/constants.js";

// ─── Create Submission ──────────────────────────────────────────────

export const createSubmissionSchema = z.object({
    mediaUrl: z.string().url("Media URL must be a valid URL"),
    mediaType: z.enum(MEDIA_TYPES, {
        errorMap: () => ({
            message: `Media type must be one of: ${MEDIA_TYPES.join(", ")}`,
        }),
    }),
    caption: z
        .string()
        .trim()
        .max(500, "Caption must be 500 characters or fewer")
        .optional(),
});

// ─── Update Submission Status (Admin/Judge) ─────────────────────────

export const updateSubmissionStatusSchema = z.object({
    status: z.enum(["approved", "rejected"], {
        errorMap: () => ({
            message: "Status must be either 'approved' or 'rejected'",
        }),
    }),
});
