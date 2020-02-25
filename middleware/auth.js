function auth(req,res,next){
    const jwt = require("jsonwebtoken");
    const secret = process.env.secret;
    // Börja med att kolla cookie om den ens existerar...
    if(req.cookies.token){

        jwt.verify(req.cookies.token,secret,function(err,token){
            if(!err){
                req.email = token.email;
                next();
            }else{
                res.send(err.message);
            }
        });

    }
    else{
        res.send("no token provided");
    }

}

module.exports = auth;