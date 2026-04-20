require("dotenv").config();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");

const DB_URL = process.env.ATLASDB_URL;

// A curated set of verified working Unsplash image URLs
const workingImages = [
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1523217582562-09d0def993a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
];

mongoose.connect(DB_URL)
  .then(async () => {
    console.log("Connected to MongoDB for Image Fix");
    const listings = await Listing.find({});
    let fixed = 0;
    let idx = 0;

    for (const listing of listings) {
      // Re-assign ALL images to verified working URLs, cycling through the list
      const newUrl = workingImages[idx % workingImages.length];
      listing.image = { url: newUrl, filename: "listingimage" };
      await listing.save();
      idx++;
      fixed++;
    }

    console.log(`✅ Fixed ${fixed} listings with verified working image URLs.`);
    await mongoose.connection.close();
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
