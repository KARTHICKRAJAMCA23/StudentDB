
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const md5 = require('md5');
const saltRounds = 10;


// console.log('weak password hash' + md5("123456"))
// console.log('Strong password hash' + md5("shhkslkstrrvdgg123"))
const app = express();
console.log(process.env.API_kEY);
app.use(express.static("public"));
app.set('view engine','ejs');
app.set("views", __dirname + "/views");
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect("mongodb+srv://karthi276:karth1ck@cluster0.bbxsjow.mongodb.net/StudentDB",{useNewUrlParser:true});
const userSchema = new mongoose.Schema({
    register:String,
    email:String,
    password:String,
})
const cashierSchema = new mongoose.Schema({
    email:String,
    password:String,

})
const fineSchema = new mongoose.Schema({
    studentname:String,
    Regno:String,
    date:String,
    email:String,
    password:String,
    course:String,
    finename:String,
    fineamount:String
})


const User = new mongoose.model("User",userSchema);
const Cashier = new mongoose.model("Cashier",cashierSchema);
const Fine = new mongoose.model("Fine",fineSchema);
app.get("/",function(req,res){
    res.render("home")
})
app.get("/submit",function(req,res){
    res.render("home");
})
app.get("/editprofile",function(req,res){
    res.render("editprofile");
})
app.get("/userlogin",function(req,res){
    res.render("userlogin")
})
app.get("/userregister",function(req,res){
    res.render("userregister")
})
app.get("/cashierregister",function(req,res){
    res.render("cashierregister")
})
app.get("/cashier",function(req,res){
    res.render("cashier")
})
app.get("/cashierlogin",function(req,res){
    res.render("cashierlogin")
})
app.get("/user",function(req,res){
    res.render("user");
})
app.get("/finedetails",function(req,res){
    res.render("finedetails");
})
app.get("/fines", function(req, res) {
    Fine.find({}, function(err, fines) {
      if (err) {
        console.log(err);
        res.status(500).send("Internal server error");
      } else {
        res.render("fines", { fines: fines });
      }
    });
  });
app.post("/userregister",function(req,res){
    bcrypt.hash(req.body.password,saltRounds,function(err,hash){
    const newUser = new User({
        register:req.body.reg,
        email:req.body.username,
        password:hash
    })
    newUser.save(function(err){
        if(err){
            console.log(err)
        }
        else{
            res.render("userhome");
        }
    })
})
})

app.post("/cashierregister",function(req,res){
    bcrypt.hash(req.body.password,saltRounds,function(err,hash){
    const newChahier = new Cashier({
        
        email:req.body.username,
        password:hash
    })
    newChahier.save(function(err){
        if(err){
            console.log(err)
        }
        else{
            res.render("submit");
        }
    })
})
})

app.post("/submit",function(req,res){
    const newFine = new Fine({
       studentname:req.body.studentname,
       Regno:req.body.Regno,
       date:req.body.date,
       email:req.body.email,
       password:req.body.password,
       course:req.body.course,
       finename:req.body.finename,
       fineamount:req.body.fineamount
    })
    newFine.save(function(err){
        if(err){
            console.log(err);
        }
        else{
            res.render("home")
        }
    })
})

app.post("/userlogin",function(req,res){
    const username = req.body.username;
    const password = req.body.password
    User.findOne({email:username},function(err,foundUser){
     if(err){
        console.log(err)
     }
     else{
        if(foundUser){
            bcrypt.compare(password,foundUser.password,function(err,result){
                if(result===true){
                    res.render("userhome")
                }
            })
        }
     }
})
})

app.post("/cashierlogin",function(req,res){
    const email = req.body.email;
    const password = req.body.password
    Cashier.findOne({email:email},function(err,foundUser){
     if(err){
        console.log(err)
     }
     else{
        if(foundUser){
            bcrypt.compare(password,foundUser.password,function(err,result){
                if(result===true){
                    res.render("cashierhome")
                }
            })
        }
     }
})
})
app.post("/edit",function(req,res){
    const email = req.body.username
    const password = md5(req.body.password)
       let register=req.body.reg;
        
    User.findOne({register:register}).updateOne({email:email}).updateOne({password:password}).updateOne({reg:register})
.then(function (users) {
  res.render("editprofile")
  })
  .catch(function (err) {
    console.log(err);
  });
});

app.listen(3000,function(){
    console.log("server is started at port 3000")
})