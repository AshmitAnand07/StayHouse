require("dotenv").config();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");

const DB_URL = process.env.ATLASDB_URL;

const validCategories = ["Beach", "Cabin", "Lake", "Design", "Pool", "Farm", "Luxury", "City"];

mongoose.connect(DB_URL)
  .then(async () => {
    console.log("Connected to MongoDB for Category Update");
    
    // Distribute missing categories (Cabin, Lake, Design, Pool, City) to some listings randomly to ensure we have data.
    const listings = await Listing.find({});
    
    for (let i = 0; i < listings.length; i++) {
        const doc = listings[i];
        let currentCat = doc.category && doc.category.length > 0 ? doc.category[0] : "";
        
        // Randomly re-assign some to the remaining categories to create an even spread
        if (i % 8 === 0) currentCat = "Cabin";
        if (i % 8 === 1) currentCat = "Lake";
        if (i % 8 === 2) currentCat = "Design";
        if (i % 8 === 3) currentCat = "Pool";
        if (i % 8 === 4) currentCat = "City";
        if (i % 8 === 5) currentCat = "Beach";
        if (i % 8 === 6) currentCat = "Farm";
        if (i % 8 === 7) currentCat = "Luxury";
        
        doc.category = [currentCat];
        await doc.save();
    }
    
    console.log(`Updated ${listings.length} listings with properly distributed standard categories.`);
    await mongoose.connection.close();
    process.exit(0);
  })
  .catch((err) => console.log(err));
