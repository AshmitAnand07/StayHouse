const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isloggedin, isOwner, validateListing, isReviewAuthor } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

//Index Route, Create Route
router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(isloggedin, 
        validateListing, 
        upload.single("listing[image]"), 
        wrapAsync(listingController.createListing)
);

//New Route
router.get("/new", isloggedin, listingController.renderNewForm);

//Show Route, Update Route, Delete Route
router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isloggedin, isOwner, upload.single("listing[image]"), 
    validateListing, wrapAsync(listingController.updateListing))
    .delete(isloggedin, isOwner, wrapAsync(listingController.destroyListing)
);

//Edit Route
router.get("/:id/edit", isloggedin, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;
