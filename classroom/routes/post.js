const express = require("express");
const router = express.Router();



//POSTS
//index - post
router.get("/",(req,res)=>{
    res.send("Get for post");
})

//show - post
router.get("/:id",(req,res)=>{
    res.send("Get for show ppposts");
})

//POST - post
router.post("/",(req,res)=>{
    res.send("POST for posts");
})

//DELETE - post
router.delete("/:id",(req,res)=>{
    res.send("Delete for post id")
})

module.exports = router;