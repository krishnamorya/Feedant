import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB, disconnectDB } from "./models/db.js";
import { User } from "./models/user.model.js";
import { Competition } from "./models/competition.model.js";

dotenv.config();

const seedData = async () => {
    try {
        await connectDB();

        // Clear existing mock data
        await User.deleteMany({ email: "admin@feedant.com" });
        await Competition.deleteMany({ title: "Global Dance Championship 2026" });

        // Create a user
        const adminUser = await User.create({
            name: "Admin",
            email: "admin@feedant.com",
            passwordHash: "dummyhash123",
            role: "admin",
            walletBalance: 0,
        });

        // Create a competition
        const competition = await Competition.create({
            title: "Global Dance Championship 2026",
            category: "Dance",
            tags: ["Dance", "Championship", "Global"],
            certificateEnabled: true,
            prizePool: 50000,
            entryFee: 500,
            currency: "INR",
            maxParticipants: 1000,
            judge: {
                name: "Remo D'Souza",
                title: "Celebrity Choreographer",
                experience: "20+ Years Experience",
                photoUrl: "https://i.pravatar.cc/150?u=remo",
            },
            registrationDeadline: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            submissionStartDate: new Date(new Date().getTime() + 8 * 24 * 60 * 60 * 1000),
            submissionEndDate: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000),
            resultDate: new Date(new Date().getTime() + 21 * 24 * 60 * 60 * 1000),
            about: "The Global Dance Championship is the premier platform for dancers worldwide to showcase their talent and compete for the ultimate title.",
            judgingParameters: [
                {
                    name: "Choreography",
                    weightage: 40,
                    description: "Creativity and originality of the dance moves."
                },
                {
                    name: "Execution",
                    weightage: 30,
                    description: "Precision, timing, and energy level."
                },
                {
                    name: "Presentation",
                    weightage: 30,
                    description: "Costume, facial expressions, and overall impact."
                }
            ],
            rules: "1. Video must be unedited.\n2. Duration should be between 2 to 4 minutes.\n3. Obscene gestures will lead to disqualification.",
            rewards: [
                {
                    position: 1,
                    label: "1st Prize",
                    amount: 25000,
                },
                {
                    position: 2,
                    label: "2nd Prize",
                    amount: 15000,
                },
                {
                    position: 3,
                    label: "3rd Prize",
                    amount: 10000,
                }
            ],
            referralBonusAmount: 50,
            status: "registration_open",
            languages: ["en"],
            disclaimer: "By participating, you agree to the terms and conditions.",
            createdBy: adminUser._id,
        });

        console.log("Mock data seeded successfully.");
        console.log("Competition ID:", competition._id);

    } catch (error) {
        console.error("Error seeding data:", error);
    } finally {
        await disconnectDB();
        process.exit(0);
    }
};

seedData();
