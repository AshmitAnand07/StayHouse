require("dotenv").config();
const mongoose = require("mongoose");
const Listing = require("../models/listing.js");

const dbUrl = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("Connected to DB for migration");
    return updateListings();
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

async function updateListings() {
  try {
    const result = await Listing.updateMany(
      { category: { $exists: false } },
      { $set: { category: "trending" } }
    );
    console.log(`Updated ${result.modifiedCount} listings with default category 'trending'.`);
  } catch (error) {
    console.error("Error updating listings:", error);
  } finally {
    mongoose.connection.close();
  }
}
