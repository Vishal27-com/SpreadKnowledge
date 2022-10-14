require("dotenv").config();
const express = require("express");
const User = require("./user.schema");
const app = express.Router();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const authMiddleWare = require("../Middleware/authmiddleware");
const tokenList={};

app.use(cookieParser());

app.post("/signup", async (req, res) => {
  try {
    await User.create(req.body);
    res.send("Posted Successfully");
  } catch (e) {
    res.send(e.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.send("Invalid credentials.");
    }
    const token = jwt.sign(
      user.toJSON(),process.env.SECRET_KEY,{expiresIn:"1 day"}
    );
    const refreshToken = jwt.sign(
      user.toJSON(),process.env.REFRESH_SECRET_KEY,{expiresIn:"7 days"}
    );
    const response={ message: "Login Success", token: token, refreshToken:refreshToken }
    tokenList[refreshToken]=response;
    res.cookie('response',response,{expires:new Date(Date.now()+86400000),secure:false,httpOnly:true})
    res.send("posted");
  } catch (e) {
    res.send(e.message);
  }
});

// To refresh the token
app.post("/token",(req,res)=>{
try {
  const refreshToken=req.cookies.response.refreshToken;
  if(refreshToken && tokenList.refreshToken){
    const user=jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY);
    const newToken=jwt.sign(user.toJSON(),process.env.SECRET_KEY,{expiresIn:"1 day"})
    tokenList[refreshToken].token=newToken;
    res.status(200).send("refresed");
  }

} catch (e) {
  
}
})



app.get("/user",authMiddleWare, (req, res) => {
  try {
    res.send("user")
  } catch (e) {
    res.send(e.message);
  }
});

module.exports = app;
