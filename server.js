var express = require('express');
var app = express();
var morgan = require('morgan');
var bodyParser = require('body-parser');
var port = 8000
var mongoose = require('mongoose');
var uri = "mongodb+srv://Shripati:SHripati@18@cluster0.wbsdd.mongodb.net/nodeJSDatabase?retryWrites=true&w=majority"
mongoose.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email:{type:String, required:true},
  username:String,
  password:String,
  University:String,
  gender:String
})

const User = mongoose.model("User",userSchema);
app.get('/', function(req,res){
 res.sendFile(__dirname + "/views/index.html")
});


app.post('/signup',bodyParser.urlencoded({extended:false}),(req,res)=>{
var email = req.body.email;
var username = req.body.username;
var password = req.body.password;
var university = req.body.university;
var gender = req.body.gender;

var user = new User({email:email,
  username:username,
  password:password,
  university:university,
  gender:gender
});

user.save().then(function(result){
  console.log(result)
  res.json(result)
})
});


app.get('/view',function(req,res){
  var uname = req.query.username;
  User.findOne({username:uname}).exec().then(doc =>{
    console.log(doc)
    res.json(doc)
  });
});


app.post('/update',bodyParser.urlencoded({extended:false}),function(req,res){
  var username = req.body.username;
  var new_uname = req.body.new_uname;
  var new_email = req.body.new_email;
  var new_university = req.body.new_univ;

  User.findOneAndUpdate({username:username}, {$set:{username:new_uname,email:new_email,university:new_university}},{new:true}).exec().then(function(result){
    console.log(result);
    res.json(result);
  });
});

app.get('/delete',function(req,res){
  var uname = req.query.username;
  User.deleteOne({username:uname}).exec().then(result =>{
    res.json({message:"User account deleted",
    result:result});
  })
})



app.listen(port,function(err){
    if(err){console.log("Error in setup")}
  console.log("Listening on port" + " "+port)  
})