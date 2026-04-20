require("dotenv").config();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");

const DB_URL = process.env.ATLASDB_URL;

mongoose.connect(DB_URL)
  .then(async () => {
    const list = await Listing.aggregate([
      { $unwind: "$category" },
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);
    console.log("=== LISTINGS PER CATEGORY ===");
    list.forEach(c => console.log(`${c._id}: ${c.count}`));
    
    console.log("\n=== EXAMPLE FILTERED RESULT (Lake) ===");
    const lakeSample = await Listing.findOne({ category: "Lake" }).select('title location price');
    console.log(lakeSample);
    
    await mongoose.connection.close();
    process.exit(0);
  })
  .catch((err) => console.log(err));
