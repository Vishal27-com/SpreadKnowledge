require("dotenv").config();
const express = require('express');
const mongoose=require("mongoose");
const userRouter=require("./Auth/user.model")
const githubLoginRouter=require("./Auth/LoginWithGithub/github.login")
const passport=require("./Auth/LoginWithGoogle/google.login")
const PORT = process.env.PORT || 8000
const app = express()
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use("/",userRouter);
app.use("/github",githubLoginRouter)
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });


mongoose.connect(process.env.DATABASE).then(()=>{
    app.listen(PORT, () => {console.log('server started on port 8000')})
})