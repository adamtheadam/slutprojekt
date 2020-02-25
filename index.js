const express = require("express");
const tingo = require("tingodb")().Db;
const app = express();
const db = new tingo(__dirname + "/database", {});
const users = db.collection("users");
const posts = db.collection("posts");
const bcrypt = require("bcryptjs");
const secret = process.env.secret;
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth");
require("dotenv").config();
console.log(process.env.ADAM);

app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.get("/", auth,(req,res) =>{

    //posts.insert({post:req.query.post,email:req.email})
    res.sendFile(__dirname + "/html/index.html");
    
});

app.get("/login", (req,res) =>{
    res.sendFile(__dirname + "/html/loginform.html")
}); 

app.post("/login", async (req,res) => {
    let {email,password} = req.body;
    users.findOne({email:email},async (err,user) =>{
        if(user){

           let pwCheck = await bcrypt.compare(password,user.password);
           if (pwCheck){

            let token = jwt.sign({email},process.env.secret,{expiresIn:"2h"});
            res.cookie("token",token,{maxAge:7200000,sameSite:"strict",httpOnly:true})
            console.log(token);
            res.redirect("/?loggedin");

           }
           else {
            res.redirect("/login?error");
           }
        }
        else {
            res.redirect("/login?error");
        }
    });
    
});

app.get("/register", (req,res) =>{
    res.sendFile(__dirname + "/html/registerform.html")
}); 

app.post("/register", async (req,res) => {
    let user = {...req.body};
    user.password = await bcrypt.hash(user.password,12);
    users.insert(user);
    res.send(req.body);
});

app.listen(2345, () => console.log("testing"));