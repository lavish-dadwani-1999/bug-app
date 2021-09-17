var User = require("../models/User")

function isAdmin (req,res,next){
    var authtoken = req.header("Authorization");
    if(authtoken){
        User.findOne({token:authtoken}).then(responce=>{
            if(responce.isadmin === false) return res.status(400).send("only admin can post")
            req.user = responce
            next()
        }).catch(err=>{
            console.log(err)
            res.status(402).send("invalid Credentials")
        })
    }
    else{
        res.status(402).send("invalid credentials")
    }
}

module.exports = isAdmin