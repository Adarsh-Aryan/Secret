require("dotenv").config()
const express=require("express")
const ejs= require("ejs")
const bodyParser=require("body-parser")
const mongoose=require("mongoose")
const encrypt= require("mongoose-encryption")

const app=express()
app.set("view engine","ejs")
app.use("/public",express.static("public"))
app.use(bodyParser.urlencoded({extended:true}))

mongoose.connect("mongodb://localhost:27017/usersDB")



const userSchema=new mongoose.Schema({
    username:String,
    password:String

})



userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields: ["password"] })

const User =mongoose.model("User",userSchema)

// const userSecretSchema= mongoose.Schema({
//     secret:String,
//     user:[userSchema]
// })

// const Secret = mongoose.model("Secret",userSecretSchema)


app.get("/",(req,res)=>{
    res.render("home")

})

app.get("/login",(req,res)=>{
    res.render("login")
})

app.get("/register",(req,res)=>{
    res.render("register")
})

app.post("/register",(req,res)=>{

    User.findOne({username:req.body.username},(err,foundUser)=>{
        if(!foundUser){
            const user = new User({
                username:req.body.username,
                password:req.body.password
            })
        
            user.save((err)=>{
                if(!err){
                    res.render("secrets",{user:user})
                }
                else{
                    res.send(err)
                }
            })
        }
        else{
            res.send("Email already exist! Try another Email to register")
        }
    })
    
})

app.get("/submit/:userId",(req,res)=>{
    let userId= req.params.userId
    User.findOne({_id:userId},(err,foundUser)=>{
        if(foundUser){
            res.render("submit")
        }
        else{
            res.send(err)
        }
    })
})

app.post("/login",(req,res)=>{
    User.findOne({username:req.body.username},(err,foundUser)=>{
        if (foundUser){
            if(foundUser.password === req.body.password){

                res.render("secrets",{user:foundUser})
            }
            else{
                res.send("Please enter the correct password")
            }
        }
        else{
            res.send("Please register first to see the amazing secrets")
        }
    })
})




app.listen(80,()=>{
    console.log("Server is starting successfully on port 80")
})