const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description : {
        type:String,
        required:true
    },
    image :{
        type:String,
        default:"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
        set:(v)=> v === "" ? "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee":v,
    },
    price : {
        type:Number,
        required:true
    },
    location: {
        type:String,
        required:true
    },
    country : {
        type:String,
        required:true
    }
});

const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;