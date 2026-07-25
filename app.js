if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}
console.log(process.env.SECRET);

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
const MongoStore = require('connect-mongo').default;
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user.js");

const dbUrl = process.env.ATLASDB_URL;

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"))
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")))



const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*3600
});

store.on("error",(err)=>{
    console.log("error in MONGO SESSION STORE",err);
})

app.use(session({
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 1000 *60 *60 *24*3,
        maxAge:1000 *60 *60 *24*3,
        httpOnly:true
    }
}));
app.use(flash());

//pasport authentications after sessions
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


const port = 8080;

const listings = require("./routes/listings.js");
const reviews = require("./routes/reviews.js");
const user = require("./routes/user.js");



main()
    .then((res)=>{
        console.log("connection successful");
    })
    .catch((err)=>{
        console.log(err);
    })

async function main(){
    await mongoose.connect(dbUrl);
}

app.get("/",(req,res)=>{
    res.redirect("/listings")
})

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.revSuccess = req.flash("revSuccess");
    res.locals.revDel = req.flash("revDel");
    res.locals.listingDel = req.flash("listingDel");
    res.locals.listingEdit = req.flash("listingEdit")
    res.locals.signUpDone = req.flash("signUpDone");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
})

app.get("/demouser", async (req, res, next) => {
    try {
        let fakeUser = new User({
            email: "student@gmail.com",
            username: "Abdullah khan"
        });
        let registeredUser = await User.register(fakeUser, "helloworld");
        
    } catch (err) {
        console.log("ACTUAL ERROR:", err);
        res.status(500).send(err.message);
    }
});

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);
app.use("/",user);



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


