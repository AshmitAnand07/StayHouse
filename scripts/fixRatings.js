const mongoose = require("mongoose");
const Review = require("../models/review.js");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const dbUrl = process.env.ATLASDB_URL;

async function fixRatings() {
    try {
        await mongoose.connect(dbUrl);
        console.log("Connected to DB.");

        const reviews = await Review.find({ rating: { $exists: false } });
        console.log(`Found ${reviews.length} reviews without ratings.`);

        if (reviews.length > 0) {
            for (let review of reviews) {
                review.rating = Math.floor(Math.random() * 3) + 3; // 3-5
                await review.save();
            }
            console.log("Updated missing ratings.");
        }

        // Also ensure all ratings are integers (optional but cleaner for simple star loop)
        await Review.updateMany(
            {},
            [{ $set: { rating: { $round: ["$rating", 0] } } }]
        );
        console.log("Rounded all ratings to nearest integer.");

    } catch (err) {
        console.error("Error fixing ratings:", err);
    } finally {
        mongoose.connection.close();
    }
}

fixRatings();
