const Listing = require("../models/listing");
const { listingSchema } = require("../schema.js"); // adjust path to wherever your Joi schemas live
const ExpressError = require("../utils/ExpressError.js"); // adjust path
const geocodingClient = require("../utils/mapToken.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const MAP_TOKEN = process.env.MAP_TOKEN;
const baseClient = mbxGeocoding({accessToken :MAP_TOKEN})

module.exports.index = async (req,res)=>{
    let allListings = await Listing.find({}).sort({_id:-1});
    res.render("listings/index.ejs",{allListings});
};

module.exports.new = (req,res)=>{
    res.render("listings/newListing.ejs");
};

module.exports.newRoute = async (req, res) => {
    if (!req.file) {
        req.flash("error", "Please upload an image.");
        return res.redirect("/listings/new");
    }

    const { error } = listingSchema.validate(req.body);
    if (error) {
        const message = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400, message);
    }

    let response = await geocodingClient
        .forwardGeocode({
            query: `${req.body.location}, ${req.body.country}`,
            limit: 1,
        })
        .send();

    if (!response.body.features.length) {
        req.flash("error", "Could not find that location on the map. Try being more specific.");
        return res.redirect("/listings/new");
    }

    const url = req.file.path;
    const filename = req.file.filename;

    let newListing = new Listing(req.body);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.geometry = response.body.features[0].geometry;

    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};


// controllers/listings.js
module.exports.searchRoute = async (req, res) => {
    const { q } = req.query;

    if (!q || q.trim() === "") {
        req.flash("error", "Please enter something to search for.");
        return res.redirect("/listings");
    }

    const allListings = await Listing.find({
        $or: [
            { title: { $regex: q, $options: "i" } },
            { location: { $regex: q, $options: "i" } },
            { country: { $regex: q, $options: "i" } },
        ],
    }).sort({_id:-1});

    res.render("listings/index.ejs", { allListings, searchQuery: q });
};

module.exports.show = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "owner",
            },
        })
        .populate("owner");
    if(!listing) throw new ExpressError(404,"Listing not found!");
    res.render("listings/show.ejs",{listing});
};

module.exports.edit = async(req,res)=>{
    let {id} = req.params; 
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
};

module.exports.editRoute = async (req, res) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const message = error.details.map(el => el.message).join(", ");
        throw new ExpressError(400, message);
    }

    let { id } = req.params;
    let oldListing = await Listing.findById(id);

    const locationChanged =
        req.body.location !== oldListing.location ||
        req.body.country !== oldListing.country;

    let listing = await Listing.findByIdAndUpdate(id, { ...req.body });

    if (locationChanged) {
        let response = await geocodingClient
            .forwardGeocode({
                query: `${req.body.location}, ${req.body.country}`,
                limit: 1,
            })
            .send();

        if (response.body.features.length) {
            listing.geometry = response.body.features[0].geometry;
        }
    }

    if (req.file) {
        listing.image = { url: req.file.path, filename: req.file.filename };
    }

    if (locationChanged || req.file) {
        await listing.save();
    }

    req.flash("listingEdit", "Listing Edited Successfully!");
    res.redirect(`/listings/${id}`);
};

module.exports.delete = async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("listingDel","Listing Deleted Successfully!")
    res.redirect("/listings")
};