var User = require("../models/User")

function Auth (req,res,next){
    var authtoken = req.header("Authorization");
    // console.log("auth",authtoken)
    if(authtoken){
        User.findOne({token:authtoken}).then(responce=>{
            // console.log(responce)
            req.user = responce
            next()
        }).catch(err=>{
           console.log(err)
            if(err)res.status(402).send("invalid Credentials")
        })
    }
    else{
        res.status(402).send("invalid credentials")
    }
}

module.exports = Auth