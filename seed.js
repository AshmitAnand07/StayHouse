require("dotenv").config();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const User = require("./models/user.js");

const DB_URL = process.env.ATLASDB_URL;

mongoose.connect(DB_URL)
  .then(() => {
    console.log("Connected to MongoDB for Seeding");
    seedDB();
  })
  .catch((err) => console.log(err));

const cities = [
  { location: "Goa", country: "India", coordinates: [73.8567, 15.2993] },
  { location: "Mumbai", country: "India", coordinates: [72.8777, 19.0760] },
  { location: "Delhi", country: "India", coordinates: [77.1025, 28.7041] },
  { location: "Paris", country: "France", coordinates: [2.3522, 48.8566] },
  { location: "New York", country: "USA", coordinates: [-74.006, 40.7128] },
  { location: "London", country: "UK", coordinates: [-0.1276, 51.5074] },
  { location: "Tokyo", country: "Japan", coordinates: [139.6917, 35.6895] },
  { location: "Sydney", country: "Australia", coordinates: [151.2093, -33.8688] },
  { location: "Bali", country: "Indonesia", coordinates: [115.1889, -8.4095] },
  { location: "Cape Town", country: "South Africa", coordinates: [18.4232, -33.9249] }
];

const descriptors = ["Cozy", "Modern", "Luxury", "Rustic", "Spacious", "Charming", "Stunning", "Beautiful"];
const places = ["Beach House", "City Apartment", "Mountain Cabin", "Farm Retreat", "Villa", "Bungalow", "Studio", "Chalet"];
const categories = ["Beach", "Mountain", "City", "Farm", "Luxury"];

const sampleImages = [
  "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1501183638710-841dd1904471?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1502672260266-1c1de2d96674?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1449844908441-8829872d2607?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
];

const seedDB = async () => {
  // Clear collections
  await Listing.deleteMany({});
  await User.deleteMany({});
  console.log("Cleared existing listings and users");

  // Create admin user
  const newUser = new User({ email: "admin@example.com", username: "admin", fName: "Admin", lName: "User" });
  const registeredUser = await User.register(newUser, "admin123");
  console.log("Created admin user with ID:", registeredUser._id);

  const seedData = [];
  
  for (let i = 0; i < 50; i++) {
    const randomCity = cities[Math.floor(Math.random() * cities.length)];
    const randomDescriptor = descriptors[Math.floor(Math.random() * descriptors.length)];
    const randomPlace = places[Math.floor(Math.random() * places.length)];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const randomPrice = Math.floor(Math.random() * 4500) + 500;
    const randomImage = sampleImages[Math.floor(Math.random() * sampleImages.length)];

    seedData.push({
      title: `${randomDescriptor} ${randomPlace} in ${randomCity.location} - ${i}`,
      description: `Experience a wonderful stay at our ${randomDescriptor.toLowerCase()} ${randomPlace.toLowerCase()} situated completely optimally in ${randomCity.location}. Perfect for a getaway with all modern amenities included.`,
      image: {
        url: randomImage,
        filename: `listingmapimage-${i}`,
      },
      price: randomPrice,
      location: randomCity.location,
      country: randomCity.country,
      owner: registeredUser._id,
      category: [randomCategory],
      geometry: {
        type: "Point",
        coordinates: randomCity.coordinates
      }
    });
  }

  const inserted = await Listing.insertMany(seedData);
  console.log(`Successfully inserted ${inserted.length} listings into ${mongoose.connection.name}.`);

  await mongoose.connection.close();
  console.log("Database connection closed.");
  process.exit(0);
};
