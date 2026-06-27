const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const data = require("./init/data.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const wrapAsync = require("./utils/wrapAsync.js");
const Joi = require("joi");
const listingSchema = require("./schema.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"))
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")))

const port = 8080;

main()
    .then((res)=>{
        console.log("connection successful");
    })
    .catch((err)=>{
        console.log(err);
    })

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}


app.get("/",(req,res)=>{
    res.send("Hello, Express!");
})


// index route
app.get("/listings",wrapAsync(async (req,res)=>{
    let allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}))

app.get("/listings/new",(req,res)=>{
    res.render("listings/newListing.ejs");
})

app.post("/listings", wrapAsync(async (req, res) => {
    console.log(req.body);
    const {error} = listingSchema.validate(req.body);
    if(error){
        const message = error.details.map(el => el.message).join(", ");
        throw new ExpressError(400,message);
    }
    let newListing = new Listing(req.body);
    await newListing.save();
    res.redirect("/listings");
}));

app.get("/listings/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) throw new ExpressError(404,"Listing not found!");
    res.render("listings/show.ejs",{listing});
}));


app.get("/listings/:id/edit",wrapAsync( async(req,res)=>{
    let {id} = req.params; 
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));

app.put("/listings/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body});
    res.redirect("/listings")
}));


app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings")
}));


app.all("{*splat}",(req,res,next)=>{
    next(new ExpressError(404,"Page not found!"))
})

app.use((err,req,res,next)=>{
    let {statusCode = 500,message="Something went wrong!"}=err;
    res.status(statusCode).render("error.ejs",{statusCode,message})
})


app.listen(port,()=>{
    console.log("App is listening on port",port);
});