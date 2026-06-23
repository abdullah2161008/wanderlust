const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description : String,
    image :{
        type:String,
        default:"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
        set:(v)=> v === "" ? "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee":v,
    },
    price : Number,
    location: String,
    country : String
});

const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;