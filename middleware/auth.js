function auth(req,res,next){
    const jwt = require("jsonwebtoken");
    const secret = process.env.secret;
    const path = require("path");
    // Börja med att kolla cookie om den ens existerar...
    if(req.cookies.token){

        jwt.verify(req.cookies.token,secret,function(err,token){
            if(!err){
                req.email = token.email;
                next();
            }else{
                res.sendFile(path.join(__dirname,"..","/html/home.html"));
            }
        });

    }
    else{
        res.sendFile(path.join(__dirname,"..","/html/home.html"));
    }
                              
}

module.exports = auth;