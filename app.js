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
const {listingSchema,reviewSchema} = require("./schema.js");
const Review = require("./models/reviews.js");
const session = require("express-session");
const flash = require("connect-flash");


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"))
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")))
app.use(session({
    secret:"mysupersecret",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 1000 *60 *60 *24*3,
        maxAge:1000 *60 *60 *24*3,
        httpOnly:true
    }
}));
app.use(flash());


const port = 8080;

const listings = require("./routes/listings.js");
const reviews = require("./routes/reviews.js");

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

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.revSuccess = req.flash("revSuccess");
    res.locals.revDel = req.flash("revDel");
    res.locals.listingDel = req.flash("listingDel");
    res.locals.listingEdit = req.flash("listingEdit")
    next();
})

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);



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

// // index route
// app.get("/listings",wrapAsync(async (req,res)=>{
//     let allListings = await Listing.find({});
//     res.render("listings/index.ejs",{allListings});
// }))

// app.get("/listings/new",(req,res)=>{
//     res.render("listings/newListing.ejs");
// })

// app.post("/listings", wrapAsync(async (req, res) => {
//     console.log(req.body);
//     const {error} = listingSchema.validate(req.body);
//     if(error){
//         const message = error.details.map(el => el.message).join(", ");
//         throw new ExpressError(400,message);
//     }
//     let newListing = new Listing(req.body);
//     await newListing.save();
//     res.redirect("/listings");
// }));

// app.get("/listings/:id",wrapAsync(async (req,res)=>{
//     let {id} = req.params;
//     const listing = await Listing.findById(id).populate("reviews");
//     if(!listing) throw new ExpressError(404,"Listing not found!");
//     res.render("listings/show.ejs",{listing});
// }));


// app.get("/listings/:id/edit",wrapAsync( async(req,res)=>{
//     let {id} = req.params; 
//     const listing = await Listing.findById(id);
//     res.render("listings/edit.ejs",{listing});
// }));

// app.put("/listings/:id",wrapAsync(async(req,res)=>{
//     let {id} = req.params;
//     await Listing.findByIdAndUpdate(id,{...req.body});
//     res.redirect("/listings")
// }));


// app.delete("/listings/:id",wrapAsync(async(req,res)=>{
//     let {id} = req.params;
//     await Listing.findByIdAndDelete(id);
//     res.redirect("/listings")
// }));



// // Reviews
// app.post("/listings/:id/reviews",wrapAsync(async(req,res)=>{
//     let {rating,comment,created_at} = req.body;
//     let {id} = req.params;

//     const {error} = reviewSchema.validate(req.body);
//     if(error){
//         const message = error.details.map(el => el.message).join(", ");
//         throw new ExpressError(400,message);
//     }

//     let listing = await Listing.findById(id);
//     if(!listing) throw new ExpressError(404,"Listing not found")
    
//     let newReview = new Review({
//         rating,
//         comment
//     });
//     listing.reviews.push(newReview);

//     await newReview.save();
//     await listing.save();

//     console.log("New Review Saved");
//     res.redirect(`/listings/${id}`)
// }));

// //review Delete route
// app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
//     let {id,reviewId} = req.params;
//     await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
//     await Review.findByIdAndDelete(reviewId);
//     res.redirect(`/listings/${id}`)
// }));


