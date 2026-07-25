const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");  
const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");

module.exports.writeReview = async(req,res)=>{
    let {rating,comment,created_at} = req.body;
    let {id} = req.params;

    const {error} = reviewSchema.validate(req.body);
    if(error){
        const message = error.details.map(el => el.message).join(", ");
        throw new ExpressError(400,message);
    }

    let listing = await Listing.findById(id);
    if(!listing) throw new ExpressError(404,"Listing not found")
    
    let newReview = new Review({
        rating,
        comment
    });
    newReview.owner = req.user._id;
    listing.reviews.push(newReview);
    

    await newReview.save();
    await listing.save();

    console.log("New Review Saved");
    req.flash("revSuccess","New Review Created!");
    res.redirect(`/listings/${id}`)
};

module.exports.delete = async(req,res)=>{
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
};