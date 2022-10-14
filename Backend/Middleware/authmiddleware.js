require("dotenv").config();
const jwt = require("jsonwebtoken");
// const cookieParser = require("cookie-parser");
const authMiddleWare=(req,res,next)=>{
    try {
        const token = req.cookies.response.token;
        console.log(token);
        if (!token) {
          return res.status(401).send("Unauthorized");
        }
        jwt.verify(token, process.env.SECRET_KEY);
        next();
      } catch (e) {
        res.send(e.message);
      }
}
module.exports=authMiddleWare;