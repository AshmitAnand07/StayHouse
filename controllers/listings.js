const Listings = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

const DEFAULT_IMAGE_URL = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=60";

const ensureImage = (listing) => {
  if (!listing.image || !listing.image.url) {
    listing.image = listing.image || {};
    listing.image.url = DEFAULT_IMAGE_URL;
  }
  return listing;
};

module.exports.index = async (req, res) => {
  let category = req.query.category;
  let allListings;
  const validCategories = ["trending", "rooms", "iconic-cities", "mountains", "castles", "amazing-pools", "camping", "farms", "arctic", "domes", "design", "vineyards"];
  
  if (category && validCategories.includes(category)) {
    allListings = await Listings.find({ category: category });
  } else {
    allListings = await Listings.find({});
    category = "all";
  }
  
  allListings = allListings.map(ensureImage);
  res.render("listings/index.ejs", { allListings, category });
};

module.exports.apiIndex = async (req, res) => {
  let { category, minPrice, maxPrice, search } = req.query;
  const filter = {};
  const validCategories = ["trending", "rooms", "iconic-cities", "mountains", "castles", "amazing-pools", "camping", "farms", "arctic", "domes", "design", "vineyards"];
  
  if (category && category !== "all" && validCategories.includes(category)) {
    filter.category = category;
  }
  
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }
  
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { location: { $regex: search, $options: "i" } }
    ];
  }
  
  let allListings = await Listings.find(filter);
  allListings = allListings.map(ensureImage);
  res.json(allListings);
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listings.findById(id)
    .populate({path: "reviews", populate: { path: "author" }}).populate("owner");
  if(!listing) {
    req.flash("error", "Listing you requested does not exist!");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
  let response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1,
  })  
  .send();
  let url = req.file.secure_url;
  let filename = req.file.public_id;
  req.body.listing.image = { url, filename };
  const newListing = new Listings(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry = response.body.features[0].geometry;
  let savedListing = await newListing.save();
  console.log(savedListing);
  req.flash("success", "New listing created!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listings.findById(id);
  if(!listing) {
    req.flash("error", "Listing you requested does not exist!");
    return res.redirect("/listings");
  }

  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_300");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listings.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") { 
    let url = req.file.secure_url;
    let filename = req.file.public_id;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Listing updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listings.findByIdAndDelete(id);
  if(!deletedListing) {
    req.flash("error", "Listing you requested does not exist!");
    return res.redirect("/listings");
  }
  console.log(deletedListing);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
