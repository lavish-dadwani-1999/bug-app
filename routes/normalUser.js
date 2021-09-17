var express = require('express');
const Auth = require('../middleware/auth');
const Bug = require('../models/Bug');

var router = express.Router();

router.patch('/updatestatus/:id', Auth, (req, res) => {
  var id = req.params.id;
  var user = req.user;
  var body = req.body;
  if (!id) return res.status(404).json({message:"Enter Id",status:404})
//   if (!body.ticket_status) return res.status(404).send('Enter Status');
  Bug.updateOne({ _id: id }, { ...req.body }).then((responce) => {
    if (!responce) return res.status(404).json({message:"Bug NOt Found",status:404})
    res.status(201).json({responce });
  }).catch(err=>{
      console.log(err)
      res.status(500).json({message:"Server Error",status:500})
  })
});

router.get('/allbugs', Auth, (req, res) => {
  var user = req.user;

  Bug.find({ })
    .then((responce) => {
      if (!responce) return res.status(400).json({message:"User Not found",status:404})
      res.status(200).json({ responce });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({message:"Server Error",status:404})
    });
});

router.get('/bugsofuser', Auth, (req, res) => {
  var user = req.user;

  Bug.find({ user: user._id })
    .then((responce) => {
      if (!responce) return res.status(400).json({message:"User Not found",status:404})
      res.status(200).json({ responce });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({message:"Server Error",status:404})
    });
});


module.exports = router;
