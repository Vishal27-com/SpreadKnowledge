const express=require("express");
const app=express.Router();
app.get('/callback',(req,res)=>{
    res.send("Github Signin is Successful")
})
module.exports=app;