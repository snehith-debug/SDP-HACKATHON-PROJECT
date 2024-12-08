if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const mongoose = require("mongoose");
const express = require("express");
const app = express();
const port  = 8000;
const {handleMongoConnect} = require("./connect.js");
const userRouter = require("./routes");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const path = require("path");
const wrapAsync = require("./utils/wrapAsync");
app.use(express.urlencoded({extended:true}));
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStratagey = require("passport-local").Strategy;
const User = require("./models/user.js");
const adminRoutes = require("./adminRoutes");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.engine("ejs",ejsMate);
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));

const sessionOptions = {
    
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }};


 app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratagey(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((err,req,res,next)=>{
    res.send("Something went wrong");
    console.log(err);
});

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});
// Add this to your existing app.js

app.use("/admin", adminRoutes);

mongo_url = "mongodb://127.0.0.1:27017/Major";

const dbUrl = process.env.ATLASDB_URL;

handleMongoConnect(mongo_url);
app.use("/",userRouter);
app.listen(3000,()=>{
    console.log("Server started!");
});