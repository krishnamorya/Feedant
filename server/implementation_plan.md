# Feedants Competition Platform — Backend System

Build a complete backend for the competition detail page shown in the screenshot, using the existing Express + TypeScript + Mongoose + Zod stack.

---

## Proposed Changes

### 1. Database Models (`models/`)

#### [NEW] [db.ts](file:///home/krishna/Desktop/server/models/db.ts)
MongoDB connection setup using Mongoose, with retry logic and graceful shutdown.

---

#### [NEW] [competition.model.ts](file:///home/krishna/Desktop/server/models/competition.model.ts)

The core model capturing everything on the competition detail page:

```
Competition {
  title:              String              // "Feedants Classical Dance"
  slug:               String (unique)     // URL-friendly identifier
  category:           Enum [Dance, Singing, Art, Photography, Writing, ...] // "Dance"
  tags:               [String]            // ["Multi-Win"]
  certificateEnabled: Boolean             // "Winners get certificate"

  // Pricing & Capacity
  prizePool:          Number              // 1500
  entryFee:           Number              // 99
  currency:           String              // "INR"
  maxParticipants:    Number              // 20
  bookedCount:        Number (virtual)    // Computed from registrations

  // Judge (embedded subdocument)
  judge: {
    name:             String              // "Manju Dubey"
    title:            String              // "Professional Kathak Dancer"
    experience:       String              // "12+ Years of Experience"
    photoUrl:         String
    introVideoUrl:    String
  }

  // Important Dates
  registrationDeadline: Date              // 10 Aug 26, 11:50 PM
  submissionStartDate:  Date              // 6 Aug 26, 04:00 AM
  submissionEndDate:    Date              // 30 Aug 26, 11:55 PM
  resultDate:           Date              // 1 Sept 26, 11:50 PM

  // Content Tabs
  about:              String              // "This is an online classical dance..."
  judgingParameters:   [{ name: String, weightage: Number, description: String }]
  rules:              String              // Rules & Eligibility text

  // Rewards
  rewards: [{
    position:         Number              // 1, 2, 3...
    label:            String              // "1st Winner", "2nd Winner"
    amount:           Number              // 550, 300, 240...
    icon:             String              // emoji or icon key
  }]

  // Referral
  referralBonusAmount: Number             // 10

  // Meta
  status:             Enum [draft, registration_open, submission_open, judging, results_declared, closed]
  language:           [String]            // ["en", "hi"]
  disclaimer:         String
  createdBy:          ObjectId → User
  timestamps:         true
}
```

---

#### [NEW] [user.model.ts](file:///home/krishna/Desktop/server/models/user.model.ts)

```
User {
  name:           String
  email:          String (unique)
  phone:          String (unique)
  passwordHash:   String
  avatarUrl:      String
  referralCode:   String (unique, auto-generated)
  referredBy:     ObjectId → User (nullable)
  walletBalance:  Number (default 0)
  role:           Enum [user, admin, judge]
  timestamps:     true
}
```

---

#### [NEW] [registration.model.ts](file:///home/krishna/Desktop/server/models/registration.model.ts)

Tracks who registered for which competition:

```
Registration {
  user:           ObjectId → User
  competition:    ObjectId → Competition
  paymentStatus:  Enum [pending, completed, refunded, failed]
  paymentId:      String       // Razorpay payment ID
  orderId:        String       // Razorpay order ID
  amountPaid:     Number
  referralCode:   String       // Code used at registration (nullable)
  registeredAt:   Date
  timestamps:     true
}

Indexes: unique compound (user + competition) — prevents double registration
```

---

#### [NEW] [submission.model.ts](file:///home/krishna/Desktop/server/models/submission.model.ts)

```
Submission {
  user:           ObjectId → User
  competition:    ObjectId → Competition
  registration:   ObjectId → Registration
  mediaUrl:       String       // Uploaded video/image URL
  mediaType:      Enum [video, image]
  caption:        String
  submittedAt:    Date
  status:         Enum [pending_review, approved, rejected]
  timestamps:     true
}
```

---

#### [NEW] [winner.model.ts](file:///home/krishna/Desktop/server/models/winner.model.ts)

Stores declared results (mapped to "Previous Winners" section):

```
Winner {
  competition:    ObjectId → Competition
  user:           ObjectId → User
  position:       Number       // 1, 2, 3...
  prizeAmount:    Number
  certificateUrl: String
  timestamps:     true
}
```

---

### 2. Zod Validation Schemas (`validators/`)

#### [NEW] [competition.validator.ts](file:///home/krishna/Desktop/server/validators/competition.validator.ts)

Comprehensive Zod schemas with these **business rules**:

| Rule | Validation |
|------|-----------|
| `registrationDeadline` must be before `submissionStartDate` | `.refine()` cross-field check |
| `submissionStartDate` must be before `submissionEndDate` | `.refine()` cross-field check |
| `submissionEndDate` must be before `resultDate` | `.refine()` cross-field check |
| `prizePool` ≥ sum of all `rewards[].amount` | `.refine()` cross-field check |
| `entryFee` ≥ 0 | `.min(0)` |
| `maxParticipants` ≥ 1 | `.min(1)` |
| `rewards` positions must be unique and sequential (1,2,3…) | `.refine()` |
| `category` must be a valid enum value | `.enum()` |

#### [NEW] [registration.validator.ts](file:///home/krishna/Desktop/server/validators/registration.validator.ts)
#### [NEW] [submission.validator.ts](file:///home/krishna/Desktop/server/validators/submission.validator.ts)
#### [NEW] [winner.validator.ts](file:///home/krishna/Desktop/server/validators/winner.validator.ts)

---

### 3. API Routes (`routes/`)

#### [NEW] [competition.routes.ts](file:///home/krishna/Desktop/server/routes/competition.routes.ts)

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| `GET` | `/api/v1/competitions` | List all competitions (with filters, pagination) | Public |
| `GET` | `/api/v1/competitions/:slug` | **Full detail page** — returns everything for the screenshot | Public |
| `POST` | `/api/v1/competitions` | Create competition | Admin |
| `PUT` | `/api/v1/competitions/:id` | Update competition | Admin |
| `DELETE` | `/api/v1/competitions/:id` | Soft delete | Admin |

**`GET /api/v1/competitions/:slug` response** (maps 1:1 to screenshot):
```json
{
  "competition": { ...all fields },
  "spotsLeft": 19,
  "bookedCount": 1,
  "registrationClosesIn": "2026-08-10T23:50:00Z",
  "previousWinners": [{ user: {name, avatar}, position, prizeAmount }],
  "isRegistered": true/false,     // if auth token present
  "hasSubmitted": true/false,     // if auth token present
  "referralLink": "https://feedants.com/r/referral123"  // if auth token present
}
```

#### [NEW] [registration.routes.ts](file:///home/krishna/Desktop/server/routes/registration.routes.ts)

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| `POST` | `/api/v1/competitions/:id/register` | Register + create Razorpay order | User |
| `POST` | `/api/v1/competitions/:id/register/verify` | Verify Razorpay payment | User |
| `GET` | `/api/v1/competitions/:id/registrations` | List registrations | Admin |

#### [NEW] [submission.routes.ts](file:///home/krishna/Desktop/server/routes/submission.routes.ts)

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| `POST` | `/api/v1/competitions/:id/submissions` | Upload submission | User |
| `GET` | `/api/v1/competitions/:id/submissions` | List submissions | Admin/Judge |
| `GET` | `/api/v1/competitions/:id/submissions/mine` | User's own submission | User |

#### [NEW] [winner.routes.ts](file:///home/krishna/Desktop/server/routes/winner.routes.ts)

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| `POST` | `/api/v1/competitions/:id/winners` | Declare winners | Admin |
| `GET` | `/api/v1/competitions/:id/winners` | Get winners (public) | Public |

#### [NEW] [referral.routes.ts](file:///home/krishna/Desktop/server/routes/referral.routes.ts)

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| `GET` | `/api/v1/referral/link` | Get user's referral link | User |
| `POST` | `/api/v1/referral/apply` | Apply referral code during registration | User |

---

### 4. Controllers (`controllers/`)

#### [NEW] [competition.controller.ts](file:///home/krishna/Desktop/server/controllers/competition.controller.ts)
#### [NEW] [registration.controller.ts](file:///home/krishna/Desktop/server/controllers/registration.controller.ts)
#### [NEW] [submission.controller.ts](file:///home/krishna/Desktop/server/controllers/submission.controller.ts)
#### [NEW] [winner.controller.ts](file:///home/krishna/Desktop/server/controllers/winner.controller.ts)
#### [NEW] [referral.controller.ts](file:///home/krishna/Desktop/server/controllers/referral.controller.ts)

---

### 5. Middleware (`middleware/`)

#### [NEW] [validate.ts](file:///home/krishna/Desktop/server/middleware/validate.ts)
Generic Zod validation middleware — wraps `schema.parse(req.body)` and returns 400 with structured error messages.

#### [NEW] [auth.ts](file:///home/krishna/Desktop/server/middleware/auth.ts)
JWT-based authentication middleware (placeholder — extracts `userId` from token and attaches to `req`).

#### [NEW] [errorHandler.ts](file:///home/krishna/Desktop/server/middleware/errorHandler.ts)
Global error handler with `ApiError` class for consistent error responses.

---

### 6. Utilities (`utils/`)

#### [NEW] [ApiError.ts](file:///home/krishna/Desktop/server/utils/ApiError.ts)
Custom error class with statusCode, message, errors array.

#### [NEW] [ApiResponse.ts](file:///home/krishna/Desktop/server/utils/ApiResponse.ts)
Standard response wrapper `{ success, statusCode, message, data }`.

#### [NEW] [asyncHandler.ts](file:///home/krishna/Desktop/server/utils/asyncHandler.ts)
Wraps async route handlers to catch unhandled promise rejections.

#### [NEW] [constants.ts](file:///home/krishna/Desktop/server/utils/constants.ts)
Enums and constants (categories, statuses, etc.).

---

### 7. Server Entry Point

#### [MODIFY] [server.ts](file:///home/krishna/Desktop/server/server.ts)
- Connect to MongoDB before starting server
- Mount all route modules under `/api/v1`
- Add global error handler middleware
- Add CORS support

#### [MODIFY] [.env](file:///home/krishna/Desktop/server/.env)
Add `MONGODB_URI`, `JWT_SECRET`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`.

---

## Edge Cases Handled

| Edge Case | How Handled |
|-----------|-------------|
| Registration after deadline | Controller checks `registrationDeadline > now` |
| Submission outside window | Controller checks `submissionStartDate ≤ now ≤ submissionEndDate` |
| Double registration | Unique compound index `(user + competition)` + controller check |
| Competition full (20/20) | Controller checks `bookedCount < maxParticipants` before registering |
| Payment failure / partial | Registration stays `pending`; verify endpoint confirms via Razorpay |
| Unpaid user submitting | Controller verifies `registration.paymentStatus === 'completed'` |
| Self-referral | Controller blocks `referredBy === self` |
| Winner declared for position already taken | Unique compound index `(competition + position)` |
| Invalid date ordering | Zod cross-field refinements reject at validation layer |
| Prize pool mismatch | Zod refinement: `prizePool ≥ Σ rewards[].amount` |
| Concurrent spot booking (race condition) | Atomic `findOneAndUpdate` with `$lt` check on booked count |

---

## Verification Plan

### Automated Tests
```bash
# Seed the database and test all endpoints
npm run dev   # Start the server
# Use manual curl / Postman calls to verify
```

### Manual Verification
- Seed a competition and verify the full detail page API response
- Test registration flow with capacity limits
- Test date-based access control for submissions
- Verify referral code generation and application
