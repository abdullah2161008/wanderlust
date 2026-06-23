const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const data = require("./init/data.js");
const path = require("path");
const methodOverride = require("method-override");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"))

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
app.get("/listings",async (req,res)=>{
    let allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});

})

app.get("/listings/new",(req,res)=>{
    res.render("listings/newListing.ejs");
})

app.post("/listings",async (req,res)=>{
    let newListing = new Listing(req.body);
    await newListing.save();
    res.redirect("/listings")
});

app.delete("/listings/:id",async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings")
})

app.put("/listings/:id",async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body});
    res.redirect("/listings")
})

app.get("/listings/:id/edit",async(req,res)=>{
    let {id} = req.params; 
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
})

app.get("/listings/:id",async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
})




app.listen(port,()=>{
    console.log("App is listening on port",port);
});