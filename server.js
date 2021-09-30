var express = require('express');
var user_routes = require('./routes/user');
var bug_routes = require("./routes/bug")
var dotenv = require("dotenv")
var cors = require("cors")
var normal_routes = require("./routes/normalUser")


dotenv.config()
var app = express();
require('./db.js');

app.use(cors())

console.log(process.env.MONGO_URI);

app.use(function(req,res,next){
  res.header("Access-Control-Allow-Origin", '*')
  res.header("Access-Control-Allow-Headers",'Content-Type')
  next()
})
app.use(express.json());


app.use(user_routes);
app.use(bug_routes)
app.use(normal_routes)
app.get('/', (req, res) => {
  res.json({status:200,message:"hello world"});
});
app.get('/someroute', (req, res) => {
  res.send("hello world ");
});
app.listen(3000);


//limitless-harbor-39413