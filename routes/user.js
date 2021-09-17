var express = require('express');
var User = require('../models/User');
var jwt = require('jsonwebtoken');
var router = express.Router();

var key = 'love';

router.post('/register', (req, res) => {
  var body = req.body;
console.log(body)
  if (!body.email || !body.password)
    return res.status(404).json({message:"Invalid Credentials",status:404})
  if (!body.name) return res.status(404).json({message:"Enter Name",status:404})
  if (body.password.length < 8)
    return res.status(404).json({message:"length should be more than 7",status:404})
  var user = new User({ ...req.body });
  jwt.sign(
    { id: user._id },
    key,
    { expiresIn: 1000 * 60 * 10 },
    function (err, token) {
      if (err) res.status(500).json({message:"server error1",status:500})
      user.token = token;
      console.log(user)
      user
        .save()
        .then((responce) => {
          res.status(201).json({ user: responce });
        })
        .catch((err) => {
          console.log(err)
          if (err.name === 'ValidationError') {
            return res.status(400).json({Validation_Error: err.message});
          }
          res.status(500).json({message:"server error2",status:500})
        });
    }
  );
});

router.post('/login', (req, res) => {
  var body = req.body;
  if (!body.email || !body.password)
    return res.status(404).json({message:"Invalid Credentials",status:404})
  if (body.password.length < 8)
    return res.status(404).json({ err: 'length should be 8' });
  User.FindByEmailAndPassword(body.email, body.password)
    .then((user) => {
      if(!user) return res.status(404).json({message:"user Not Found",status:404})
      console.log(user)
      jwt.sign(
        { id: user._id },
        key,
        { expiresIn: 1000 * 60 * 10 },
        function (err, token) {
          if (err) res.status(500).json({message:"server error",status:500})
          console.log('token', token);
          user.token = token
          User.updateOne({ _id: user._id }, { token: token })
            .then((responce) => {
              res.status(201).json({ user:user });
            })
            .catch((err) => {
              console.log(err);
            });
        }
      );
    })
    .catch((err) => {
      if (err === 'User Not Found') return res.status(404).send(err);
    });
});


router.delete('/logout', (req, res) => {
    var authtoken = req.header("Authorization");
    if(authtoken){
        User.findOneAndUpdate({token:authtoken},{token:null}).then(responce=>{
            if(responce) res.status(201).json({message:"log out",status:201})
        }).catch(err=>{
            console.log(err)
            res.status(402).json({message:"Invalid Credentials",status:404})
        })
    }
    else{
        res.status(402).json({message:"Invalid Credentials",status:404})
    }
  });


module.exports = router;
