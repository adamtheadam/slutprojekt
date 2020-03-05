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

/* doStuff();
async function doStuff(){
    try {
        let myData = await getData();
        console.log(myData);
    } catch (error) {
        console.log(error);
    };
}; */

function insertData(data){
   
    return new Promise((resolve,reject) =>{
        posts.insert(data, (err) =>{
            if(err) reject("Insert Tingo Error");
            else resolve("success");
        });

    });

};

function getData(){

    return new Promise((resolve,reject) =>{

        posts.find().toArray((err,data) =>{

            if(err) reject("data error");
            else resolve(data);

        });

    });

};

////////////////////// Paths //////////////////////

app.get("/create", auth,(req,res) =>{

    res.sendFile(__dirname + "/html/create.html");   

});

app.post("/create", auth,async(req,res) =>{

    try {
        await insertData(req.body);
        res.send("data saved");
    } catch (error) {
        res.send(error);
    }

});

    // Sends index.html to /
app.get("/", auth,(req,res) =>{

    res.sendFile(__dirname + "/html/index.html");   

});
    
    // Sends loginform.html to /login
app.get("/login", (req,res) =>{

    res.sendFile(__dirname + "/html/loginform.html")

}); 
    
    // Login token
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
           
        };
        
        }
        else {

            res.redirect("/login?error");
        
        };
        
    });

});
    
    // Logout function
app.get("/logout", (req,res) =>{   
    res.clearCookie("token");
    res.redirect("/");
}); 
    
    // Sends registerform.html to /register
app.get("/register", (req,res) =>{
    res.sendFile(__dirname + "/html/registerform.html")
});
    
    // Register user function
app.post("/register", async (req,res) => {    
    let user = {...req.body};
    user.password = await bcrypt.hash(user.password,12);
    users.insert(user);
    res.send(req.body);
});
    
app.listen(2345, () => console.log("testing"));