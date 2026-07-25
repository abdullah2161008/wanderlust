const express = require("express");
const router = express.Router({ mergeParams: true });


const Review = require("../models/reviews.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");  
const Listing = require("../models/listing.js");
const { isLoggedIn, isReviewOwner } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js") 

// Reviews
router.post("/",isLoggedIn,wrapAsync(reviewController.writeReview));

//review Delete route
router.delete("/:reviewId", isLoggedIn, isReviewOwner, wrapAsync(reviewController.delete));

module.exports = router;