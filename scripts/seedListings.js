require("dotenv").config();
const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");
const readline = require("readline");

const dbUrl = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/wanderlust";

const categories = ["trending", "rooms", "iconic-cities", "mountains", "castles", "amazing-pools", "camping", "farms", "arctic", "domes", "design", "vineyards"];

const locations = [
  { location: "Manali", country: "India", coords: [77.1887, 32.2396] },
  { location: "Swiss Alps", country: "Switzerland", coords: [8.2275, 46.8182] },
  { location: "New York", country: "USA", coords: [-74.0060, 40.7128] },
  { location: "Paris", country: "France", coords: [2.3522, 48.8566] },
  { location: "Goa", country: "India", coords: [73.8567, 15.2993] },
  { location: "Tokyo", country: "Japan", coords: [139.6917, 35.6895] },
  { location: "London", country: "UK", coords: [-0.1276, 51.5072] },
  { location: "Bali", country: "Indonesia", coords: [115.1889, -8.4095] },
  { location: "Santorini", country: "Greece", coords: [25.4315, 36.3932] },
  { location: "Tromso", country: "Norway", coords: [18.9553, 69.6492] }
];

const images = [
  "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1504280390267-33106d48ee28?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1510798831971-661eb04b3739?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
];

const titles = [
  "Cozy Mountain Cabin", "Luxury Beachfront Villa", "Modern City Apartment",
  "Rustic Farmhouse Retreat", "Historic Castle Stay", "Desert Glamping Dome",
  "Secluded Forest Treehouse", "Chic Studio Loft", "Tropical Pool Oasis",
  "Arctic Igloo Experience"
];

async function seedDB() {
  const users = await User.find({});
  let ownerId = "69f1fe9521ddd8c30470d8ec"; // Fallback dummy ID
  if (users.length > 0) {
    ownerId = users[0]._id; // Use real user from DB if available
  }

  const seedData = [];
  
  for (let i = 0; i < 50; i++) {
    const randomLoc = locations[Math.floor(Math.random() * locations.length)];
    const randomImage = images[Math.floor(Math.random() * images.length)];
    const randomCategory = categories[i % categories.length]; // Guarantee even distribution
    const randomTitle = titles[Math.floor(Math.random() * titles.length)];
    const randomPrice = Math.floor(Math.random() * 20000) + 1000;
    
    seedData.push({
      title: `${randomTitle} in ${randomLoc.location}`,
      description: `Experience the best of ${randomLoc.location} in this beautiful property. Perfectly suited for couples, families, or solo travelers looking for a memorable getaway. Features stunning views, modern amenities, and close proximity to local attractions.`,
      image: {
        url: randomImage,
        filename: "seed_image_" + i
      },
      price: randomPrice,
      location: randomLoc.location,
      country: randomLoc.country,
      category: randomCategory,
      geometry: {
        type: "Point",
        coordinates: randomLoc.coords
      },
      owner: ownerId
    });
  }

  await Listing.deleteMany({});
  await Listing.insertMany(seedData);
  console.log(`Successfully seeded ${seedData.length} listings!`);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

mongoose.connect(dbUrl)
  .then(() => {
    console.log("Connected to DB successfully.");
    rl.question("⚠️ WARNING: Are you sure you want to DELETE all existing listings and seed 50 new ones? (yes/no): ", async (answer) => {
      if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
        try {
          console.log("Seeding database... Please wait.");
          await seedDB();
        } catch (error) {
          console.error("Seeding error:", error);
        }
      } else {
        console.log("Seeding aborted.");
      }
      mongoose.connection.close();
      rl.close();
    });
  })
  .catch(err => {
    console.error("DB Connection Error:", err);
    rl.close();
  });
