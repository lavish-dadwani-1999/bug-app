var express = require("express")
const Auth = require("../middleware/auth")
const isAdmin = require("../middleware/isAdmin")
const Bug = require("../models/Bug")
const User = require("../models/User")

var router = express.Router()

router.get("/user", Auth,(req,res)=>{
    var user = req.user
    res.status(200).json({user})
})
 
// create Bug By email
router.post("/bug/:email",Auth,isAdmin,(req,res)=>{
  var email = req.params.email
  var user = null
  var body = req.body
  if (!body.title || !body.ticket_description)
  return res.status(404).json({message:"Invalid Credentials",status:404})
// if (!body.ticket_status) return res.status(404).send('Enter status');
// if(!Boolean(body.ticket_status))return res.status(404).send("invalid Credentials5")

  User.findOne({email:email}).then(responce=>{
    if(!responce) return res.status(404).json({message:"User Not Found",status:404})
    user = responce
    var bug = new Bug({...req.body})
    bug.user= user._id
    bug.email = user.email
    user.bugs.push(bug)
  
    user.save().then(responce=>{
      console.log("save success")
  }).catch(err=>{
      console.log(err.message)
      if(err)res.status(500).json({message:"server error",status:500})
  })
  bug.save().then((responce) => {
    res.status(201).json({ bug: responce });
  })
  .catch((err) => {
      if (err.name === 'ValidationError')
        return res.status(400).send(`Validation Error:${err.message}`);
      console.log(err.message);
      res.status(500).json({message:"server error",status:500})
    })
  }).catch(err=>{
    console.log(err)
    res.status(500).json({message:"server error",status:500})
  })

 
})
// create bug for admin
router.post('/bug',Auth,isAdmin, (req, res) => {                     
    var body = req.body;
  var user = req.user
    if (!body.title || !body.ticket_description)
      return res.status(404).json({message:"Invalid Credentials",status:404});
    if (!body.ticket_status) return res.status(404).json({message:"Enter status",status:404});
    if(!Boolean(body.ticket_status))return res.status(404).json({message:"Invalid Credentials",status:404})
    var bug = new Bug({ ...req.body });
    bug.user =user._id
    user.bugs.push(bug)

    user.save().then(responce=>{
        console.log("save success")     //
    }).catch(err=>{
        console.log(err.message)
        if(err)res.status(500).json({message:"server error",status:500})
    })
    bug.save().then((responce) => {
      res.status(201).json({ bug: responce });
    })
    .catch((err) => {
        if (err.name === 'ValidationError')
          return res.status(400).send(`Validation Error:${err.message}`);
        console.log(err.message);
        res.status(500).json({message:"server error",status:500})
      })
  });

  
router.delete('/deleteBug/:id',Auth,isAdmin, (req, res) => {
  var id = req.params.id
 
var user = req.user
  Bug.deleteOne({id:id}).then(bug=>{
    if(!bug)return res.status(400).send("bug Not found")
    res.status(201).send("delete")
  }).catch(err=>{
    if (err.name === 'CastError')
    return res.status(400).send(`Invalid Todo Id`);
    console.log(err.message)
    res.status(500).json({message:"server error",status:500})
  })

  
});



router.patch('/updateBug/:id',Auth,isAdmin, (req, res) => {
  var id = req.params.id
  var body = req.body;
var user = req.user
  if (!body.title || !body.ticket_description)
    return res.status(404).json({message:"Invalid Credentials",status:404})
  // if (!body.ticket_status) return res.status(404).send('Enter status');
  // if(!Boolean(body.ticket_status))return res.status(404).json({message:"Invalid Credentials",status:404})
  Bug.updateOne({_id:id,user:user._id},{...req.body},{new:true}).then(responce=>{
    if(!responce) return res.status(404).send("bug not found")
    res.status(201).json({bug:responce})
  }).catch((err) => {
    if (err.name === 'CastError')
      return res.status(400).send(`Invalid Todo Id`);
    if (err.name === 'ValidationError')
      return res.status(400).send(`Validation Error:${err.message}`);
    console.log(err.message);
    return res.status(500).json({message:"server error",status:500})
  });

  
});



module.exports= router