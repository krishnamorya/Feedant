# Feedants - Competition Details Screen

This repository contains the full-stack implementation of the Feedants Competition Details screen, built as part of the Full Stack Development Internship technical assignment.

## Tech Stack
* **Frontend**: React Native (Expo)
* **Backend**: Node.js + Express.js
* **Database**: MongoDB (Mongoose)

---

## 🚀 Getting Started

### 1. Environment Setup

#### Backend (`/server`)
Create a `.env` file in the `server` directory with the following variables:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

#### Frontend (`/Feedant`)
The frontend uses the `services/api.ts` file to configure the API connection. By default, it connects to `http://10.0.2.2:5000` (for Android emulator) or `localhost:5000` (for iOS).

### 2. Running the Backend

1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Seed the database with mock data:
   ```bash
   npx tsx seed.ts
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```

### 3. Running the Frontend (React Native)

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd Feedant
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Expo server:
   ```bash
   npx expo start
   ```
4. Press `a` to run on an Android emulator or `i` for an iOS simulator. 

---

## 🧠 Approach & Explanations

### Important Assumptions Made
1. **API Usage for the Screen**: For the purpose of displaying this specific screen seamlessly, the frontend assumes that the most relevant competition is the first one returned from the `/api/v1/competitions` endpoint.
2. **Authentication State**: The screen is implemented assuming the user is mostly a guest (unauthenticated). Placeholder logic is provided for referral links and specific states.
3. **Graceful Degradation**: It is assumed that if the backend fails, showing the fallback static UI is preferable to showing a blank screen or a hard crash.

### Major Technical Decisions
1. **Mongoose Hooks (`pre('validate')`)**: Handled dynamic field generation (like `slug` for competitions and `referralCode` for users) cleanly at the database schema level before validation.
2. **Modular Component Structure**: The React Native UI is split into small, reusable pieces (e.g., `CompetitionHeader`, `JudgeCard`, `RewardsTable`) rather than one massive file, improving readability and maintainability.
3. **Data Mapping Strategy**: Instead of completely rewriting frontend components to match backend schema keys, a mapper was used in `competitions.tsx` to map backend JSON data to the frontend's expected format. 

### Trade-offs Considered
1. **Direct API Fetch vs. State Management**: I opted for standard React `useEffect` + `useState` fetching over heavier libraries (like Redux or React Query). This trade-off saves boilerplate for a small assignment but loses caching and automatic retries out of the box.
2. **Global Loading vs. Skeleton Loaders**: Used a simple `ActivityIndicator` (spinner) while fetching data to save time over building complex skeleton placeholder animations, although skeletons look better in production.
3. **List Fetch vs. Slug Fetch**: Used the generic list fetch to grab the first competition instead of passing route params to fetch a specific slug. This was a trade-off for simplicity in linking the existing screen.

### Improvements for Production
1. **Dynamic Routing**: Pass a `slug` via React Navigation/Expo Router params to `competitions.tsx` and fetch the exact competition using `GET /api/v1/competitions/:slug`.
2. **Robust State Management**: Implement React Query (TanStack Query) for fetching, caching, and handling loading/error states out-of-the-box.
3. **Skeleton Loading UI**: Replace the basic spinner with skeleton loaders that mimic the shape of the content to reduce perceived loading times.
4. **Caching & CDN**: Use Redis on the backend to cache competition details, as they are read-heavy and updated infrequently.
5. **Testing**: Add Jest and React Native Testing Library for the frontend, and Supertest for backend API validation.
