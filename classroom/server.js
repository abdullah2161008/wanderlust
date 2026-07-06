const express = require("express");
const app = express();
const port = 8080;
const users = require("./routes/user");
const posts = require("./routes/post");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.use(session({
    secret:"mysupersecretstring",
    resave:false,
    saveUninitialized:true
}));
app.use(flash());


app.get("/register",(req,res)=>{
    let {name="Anonymous"} = req.query;
    req.session.name = name;
    if(name==="Anonymous"){
        req.flash("error","user not registered");
    }else{
        req.flash("success","user registered successfully");
    }
    res.redirect("/hello")
});

app.use((req,res,next)=>{
    res.locals.successMsg = req.flash("success");
    res.locals.errMsg = req.flash("error");
    next();
})

app.get("/hello",(req,res)=>{
    res.render("Page.ejs",{name:req.session.name});
});

// app.get("/test",(req,res)=>{
//     res.send("test successful!");
// })




// app.get("/reqcount",(req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count = 1;
//     }
//     res.send(`You send a req ${req.session.count} times`);
// });
// app.use(session({
//   secret: 'your-secret-key',   // cookie ko sign karne ke liye
//   resave: false,               // agar session change nahi hui to save mat karo
//   saveUninitialized: false,    // empty session save mat karo
//   cookie: { secure: false, maxAge: 1000 * 60 * 60 } // 1 hour expiry
// }));



// console.log("users:", typeof users);
// console.log("posts:", typeof posts);

// app.get("/setcookies",(req,res)=>{
//     res.cookie("class","bachelors",{signed:true});
//     res.send("signed cookie sent");
// })  

// app.get("/getcookie",(req,res)=>{
//     res.send(req.signedCookies);
// });



app.use("/posts",posts);
app.use("/users",users);

app.get("/",(req,res)=>{
    res.send("hi i am route");
})

app.listen(port,()=>{
    console.log("app is listening on port ",port);
})