// ─── Competition Categories ──────────────────────────────────────────
export const CATEGORIES = [
    "Dance",
    "Singing",
    "Art",
    "Photography",
    "Writing",
    "Comedy",
    "Acting",
    "Music",
    "Cooking",
    "Fashion",
    "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];

// ─── Competition Status ─────────────────────────────────────────────
export const COMPETITION_STATUSES = [
    "draft",
    "registration_open",
    "submission_open",
    "judging",
    "results_declared",
    "closed",
] as const;

export type CompetitionStatus = (typeof COMPETITION_STATUSES)[number];

// ─── Payment Status ─────────────────────────────────────────────────
export const PAYMENT_STATUSES = [
    "pending",
    "completed",
    "refunded",
    "failed",
] as const;

export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

// ─── Submission Status ──────────────────────────────────────────────
export const SUBMISSION_STATUSES = [
    "pending_review",
    "approved",
    "rejected",
] as const;

export type SubmissionStatus = (typeof SUBMISSION_STATUSES)[number];

// ─── Media Types ────────────────────────────────────────────────────
export const MEDIA_TYPES = ["video", "image"] as const;

export type MediaType = (typeof MEDIA_TYPES)[number];

// ─── User Roles ─────────────────────────────────────────────────────
export const USER_ROLES = ["user", "admin", "judge"] as const;

export type UserRole = (typeof USER_ROLES)[number];

// ─── Supported Languages ───────────────────────────────────────────
export const LANGUAGES = ["en", "hi"] as const;

export type Language = (typeof LANGUAGES)[number];

// ─── Default Currency ───────────────────────────────────────────────
export const DEFAULT_CURRENCY = "INR";

// ─── Referral Bonus ─────────────────────────────────────────────────
export const DEFAULT_REFERRAL_BONUS = 10;
