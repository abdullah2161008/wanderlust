const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport  = require("passport");
const {isLoggedIn, saveRedirectUrl} = require("../middleware.js");

const usersController = require("../controllers/users.js");

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post(
  "/signup",
  wrapAsync(usersController.signup)
);

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  usersController.login
);


router.get("/logout",isLoggedIn,usersController.login);

module.exports = router;
