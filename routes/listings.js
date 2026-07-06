const express = require("express");
const router = express.Router();

const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");  


router.get("/",wrapAsync(async (req,res)=>{
    let allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}))

router.get("/new",(req,res)=>{
    res.render("listings/newListing.ejs");
})

router.post("/", wrapAsync(async (req, res) => {
    console.log(req.body);
    const {error} = listingSchema.validate(req.body);
    if(error){
        const message = error.details.map(el => el.message).join(", ");
        throw new ExpressError(400,message);
    }
    let newListing = new Listing(req.body);
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
}));

router.get("/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing) throw new ExpressError(404,"Listing not found!");
    res.render("listings/show.ejs",{listing});
}));


router.get("/:id/edit",wrapAsync( async(req,res)=>{
    let {id} = req.params; 
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));

router.put("/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body});
    req.flash("listingEdit","Listing Edited Successfully!")
    res.redirect("/listings")
}));


router.delete("/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("listingDel","Listing Deleted Successfully!")
    res.redirect("/listings")
}));

module.exports =  router;