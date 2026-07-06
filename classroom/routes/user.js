const express = require("express");
const router = express.Router();


//index - users
router.get("/",(req,res)=>{
    res.send("Get for users");
})

//show - users
router.get("/:id",(req,res)=>{
    res.send("Get for show users");
})

//POST - users
router.post("/",(req,res)=>{
    res.send("POST for users");
})

//DELETE - users
router.delete("/:id",(req,res)=>{
    res.send("Delete for users id")
})

module.exports = router;