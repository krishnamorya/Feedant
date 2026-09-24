# Feedants Backend — Walkthrough

## What Was Built

A complete backend system for the Feedants competition platform, powering the competition detail page and all related flows.

---

## Architecture

```
server/
├── server.ts                           # Entry point — DB connect, route mounting, error handler
├── .env                                # Environment variables
├── tsconfig.json                       # TypeScript configuration
├── models/
│   ├── db.ts                           # MongoDB connection with graceful shutdown
│   ├── competition.model.ts            # Core competition model (judge, rewards, dates)
│   ├── user.model.ts                   # User with referral codes & wallet
│   ├── registration.model.ts           # User ↔ Competition registrations + payment
│   ├── submission.model.ts             # Media submissions per participant
│   └── winner.model.ts                 # Declared winners per competition
├── validators/
│   ├── competition.validator.ts        # 6 cross-field Zod refinements
│   ├── registration.validator.ts       # Register + payment verification
│   ├── submission.validator.ts         # Media upload + admin status update
│   └── winner.validator.ts             # Batch winner declaration
├── middleware/
│   ├── validate.ts                     # Generic Zod middleware (body/query/params)
│   ├── auth.ts                         # authenticate, authorize, optionalAuth
│   └── errorHandler.ts                 # Catches ApiError, Mongoose, duplicate key
├── controllers/
│   ├── competition.controller.ts       # CRUD + aggregated detail page endpoint
│   ├── registration.controller.ts      # Register + verify payment + list
│   ├── submission.controller.ts        # Upload + list + get own submission
│   ├── winner.controller.ts            # Declare + list winners
│   └── referral.controller.ts          # Get link + apply code
├── routes/
│   ├── competition.routes.ts
│   ├── registration.routes.ts
│   ├── submission.routes.ts
│   ├── winner.routes.ts
│   └── referral.routes.ts
└── utils/
    ├── ApiError.ts                     # Custom error class
    ├── ApiResponse.ts                  # Standard response wrapper
    ├── asyncHandler.ts                 # Async route wrapper
    └── constants.ts                    # Enums & constants
```

---

## API Endpoints (14 total)

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| `GET` | `/api/v1/competitions` | Public | List with filters, pagination, sort |
| `GET` | `/api/v1/competitions/:slug` | Optional | **Full detail page data** |
| `POST` | `/api/v1/competitions` | Admin | Create competition |
| `PUT` | `/api/v1/competitions/:id` | Admin | Update competition |
| `DELETE` | `/api/v1/competitions/:id` | Admin | Soft-delete (set to closed) |
| `POST` | `/api/v1/competitions/:id/register` | User | Register + create payment order |
| `POST` | `/api/v1/competitions/:id/register/verify` | User | Verify Razorpay payment |
| `GET` | `/api/v1/competitions/:id/register` | Admin | List registrations |
| `POST` | `/api/v1/competitions/:id/submissions` | User | Upload submission |
| `GET` | `/api/v1/competitions/:id/submissions` | Admin/Judge | List all submissions |
| `GET` | `/api/v1/competitions/:id/submissions/mine` | User | Get own submission |
| `POST` | `/api/v1/competitions/:id/winners` | Admin | Declare winners (batch) |
| `GET` | `/api/v1/competitions/:id/winners` | Public | Get winners list |
| `GET` | `/api/v1/referral/link` | User | Get referral link |
| `POST` | `/api/v1/referral/apply` | User | Apply referral code |

---

## Edge Cases Handled

| Edge Case | Where Handled |
|-----------|---------------|
| Registration after deadline | [registration.controller.ts](file:///home/krishna/Desktop/server/controllers/registration.controller.ts) — checks `now > registrationDeadline` |
| Submission outside window | [submission.controller.ts](file:///home/krishna/Desktop/server/controllers/submission.controller.ts) — checks start/end dates |
| Double registration | Unique compound index `(user, competition)` + controller check |
| Competition full (capacity) | Controller checks `bookedCount >= maxParticipants` |
| Unpaid user submitting | Controller verifies `paymentStatus === 'completed'` |
| Self-referral | Both [registration.controller.ts](file:///home/krishna/Desktop/server/controllers/registration.controller.ts) and [referral.controller.ts](file:///home/krishna/Desktop/server/controllers/referral.controller.ts) block it |
| Double referral usage | [referral.controller.ts](file:///home/krishna/Desktop/server/controllers/referral.controller.ts) — checks `referredBy` is null |
| Winner position already taken | Unique index `(competition, position)` |
| Deleting competition with paid users | Blocked — forces soft-delete to "closed" |
| Reducing maxParticipants below registrations | [competition.controller.ts](file:///home/krishna/Desktop/server/controllers/competition.controller.ts) — compares against current count |
| Editing closed/declared competition | Blocked in update controller |
| Declaring winners before submissions close | Blocked in winner controller |
| Invalid date ordering | 6 Zod cross-field refinements in [competition.validator.ts](file:///home/krishna/Desktop/server/validators/competition.validator.ts) |

---

## Verification

- ✅ All TypeScript imports resolve correctly
- ✅ No syntax errors — tsx loaded the full module graph successfully
- ⚠️ MongoDB connection failed (expected — MongoDB is not running in sandbox)

## To Run

```bash
# Make sure MongoDB is running, then:
npm run dev
```
