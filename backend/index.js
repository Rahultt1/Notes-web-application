
require("dotenv").config();

const mongoose = require("mongoose");
const config = require("./config.json");

mongoose.connect(config.connectionString);

const User = require("./models/user.model");

const express = require("express")
const cors = require("cors")
const app = express();

const jwt = require("jsonwebtoken");
const {authenticateToken} = require("./utilities");



app.use(express.json());

app.use(cors({
    origin: "*"
}));

app.get("/", (req, res) => {
    res.json({
        data: "Hello World"
    });
});
app.listen(8000, () => {
    console.log("Server is running on port 8000");
})
app.post("/create-account", async (req, res) => {
    const {fullName, email, password} = req.body;
    if(!fullName){
        return res
        .status(400)
        .json({error: "Full Name is required"});
    }

    if(!email){
        return res
        .status(400)        
        .json({error:true, message: "Email is required"});
    }

    if(!password){
        return res
        .status(400)
        .json({error:true, message: "Password is required"});
    }
    
    const isUser = await User.findOne({email:email});

    if(isUser){
        return res.json({
            error:true,
             message: "User already exists"
        });
    }

    const user = new User({fullName, email, password});
    await user.save();

   const accessToken = jwt.sign({user},process.env.ACCESS_TOKEN_SECRET,{expiresIn:"1h",});

  return res.json({
    error: false,
    user, 
    accessToken,
    message: "User created successfully",
    
  })
})

app.post("/login", async (req, res) => {
    const {email, password} = req.body;
    if(!email){
        return res
        .status(400)
        .json({message: "Email is required"});
    }

    if(!password){
        return res
        .status(400)
        .json({message: "Password is required"});
    }
    const userInfo = await User.findOne({email:email});
    if(!userInfo){
        return res    
        .status(400)
        .json({message: "User not found"});
    }

    if(userInfo.email == email && userInfo.password == password){
        const user = {user:userInfo};
        const accessToken = jwt.sign({user},process.env.ACCESS_TOKEN_SECRET,{expiresIn:"1h",});

    

    return res.json({
        error: false,
        message: "User logged in successfully",
        email,
        accessToken,
      });

    } else {

        return res    
        .status(400)
        .json({message: "Invalid credentials"});    

    }

    
    
})

//Add notes 
app.post("/add-note", authenticateToken, async (req, res) => {
    const {title, content} = req.body;
    const user = req.user;
    const note = new Note({title, content, user});
    await note.save();
    return res.json({error: false, message: "Note added successfully"});
})

module.exports = app
