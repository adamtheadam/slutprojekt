const express = require("express");
const app = express();

app.get("/create", (req,res) =>{
    res.sendfile(__dirname + "/html/form.html")
}); 

app.post("/create", (req,res) => {
    res.send(req.body);
});

app.listen(2345, () => console.log("testing"));