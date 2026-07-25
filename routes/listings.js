const express = require("express");
const router = express.Router();
const geocodingClient = require("../utils/mapToken.js");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

//here we use router.route() method

router.get("/search", wrapAsync(listingController.searchRoute));

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("image"),
    wrapAsync(listingController.newRoute)
);

//index route
// router.get("/",wrapAsync(listingController.index));

//new route
router.get("/new", isLoggedIn, listingController.new);
// router.post("/", isLoggedIn,wrapAsync(listingController.newRoute));
// routes/listing.js


router
  .route("/:id")
  .get(wrapAsync(listingController.show))
  .put(isLoggedIn, isOwner,upload.single("image"), wrapAsync(listingController.editRoute))
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.delete));

//show route
// router.get("/:id",wrapAsync(listingController.show));

//edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.edit));

// router.put("/:id",isLoggedIn,isOwner,wrapAsync(listingController.editRoute));

// router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.delete));

module.exports = router;
