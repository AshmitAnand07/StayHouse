const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const User = require("../models/user.js");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const dbUrl = process.env.ATLASDB_URL;

const comments = [
    "Amazing stay! The location was perfect and very clean.",
    "Wonderful experience, highly recommend this place.",
    "The views were breathtaking and the host was great.",
    "Loved the interiors and the host was very helpful. Would definitely visit again.",
    "Great location near everything. The apartment was exactly as described.",
    "Very cozy and well-maintained. The amenities were top-notch.",
    "Great place. Highly recommend.",
    "Excellent!",
    "Loved it!",
    "Perfect stay.",
    "Nice stay overall, but WiFi could be better.",
    "Good location but a bit noisy at night.",
    "Everything was fine, but the bathroom was a bit small.",
    "Beautiful place, very peaceful and relaxing.",
    "The host was super responsive and helpful. 10/10.",
    "Clean, modern, and in a great neighborhood.",
    "Value for money! Would book again without hesitation.",
    "A bit far from the city center but worth it for the quiet.",
    "The kitchen was well-equipped, which was great for our long stay.",
    "Stunning decor and very comfortable beds."
];

async function seedReviews() {
    try {
        console.log("Connecting to Database...");
        await mongoose.connect(dbUrl);
        console.log("Connected to DB.");

        // 1. Ensure users exist
        const dummyUsers = [
            { email: "john@gmail.com", username: "john_doe" },
            { email: "jane@gmail.com", username: "jane_smith" },
            { email: "alex@gmail.com", username: "alex_travels" }
        ];

        for (let u of dummyUsers) {
            const existingUser = await User.findOne({ email: u.email });
            if (!existingUser) {
                console.log(`Creating dummy user: ${u.username}`);
                const newUser = new User({ email: u.email, username: u.username });
                await User.register(newUser, "password123");
            }
        }
        
        let users = await User.find({});
        console.log(`${users.length} users ready.`);

        // 2. Check for existing reviews
        const reviewCount = await Review.countDocuments();
        if (reviewCount > 0) {
            console.log(`Found ${reviewCount} existing reviews. Resetting as requested...`);
            console.log("Clearing existing reviews...");
            await Review.deleteMany({});
            await Listing.updateMany({}, { $set: { reviews: [] } });
            console.log("Reviews cleared.");
        }

        // 3. Generate reviews for each listing
        const listings = await Listing.find({});
        console.log(`Seeding reviews for ${listings.length} listings...`);

        for (let listing of listings) {
            // Randomly decide 2 or 3 reviews
            const numReviews = Math.floor(Math.random() * 2) + 2; 
            
            for (let i = 0; i < numReviews; i++) {
                const randomUser = users[Math.floor(Math.random() * users.length)];
                const randomComment = comments[Math.floor(Math.random() * comments.length)];
                const randomRating = (Math.random() * (5 - 3.5) + 3.5).toFixed(1); // 3.5 to 5.0

                const newReview = new Review({
                    comment: randomComment,
                    rating: parseFloat(randomRating),
                    author: randomUser._id,
                    createdAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000)) // Random date in last ~11 days
                });

                await newReview.save();
                listing.reviews.push(newReview._id);
            }
            await listing.save();
        }

        console.log("Seeding completed successfully!");
    } catch (err) {
        console.error("Error seeding reviews:", err);
    } finally {
        mongoose.connection.close();
    }
}

seedReviews();
