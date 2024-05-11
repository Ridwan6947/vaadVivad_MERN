import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// REGISTER USER
export const Register = async (req , res) =>{
    const {firstName , lastName , email , password, picturePath , friends , location , occupation} = req.body;
    try {
        if(!firstName || !lastName || !email || !password){
            return res.status(400).json({msg: "Please fill all the fields"});
        }
        const userExist = await User.findOne({email});
        if(userExist){
            return res.status(400).json({msg: "User already exists"});
        }
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password,salt);
        const newUser = await User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation,
        });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json({error : err.message});
    }
};

export const login = async (req , res) =>{
    try {
        const{email , password} = req.body;
        if(!email || !password){
            return res.status(400).json({msg: "Please fill all the fields"});
        }
        const userExist = await User.findOne({email : email});
        if(!userExist){
            return res.status(400).json({msg: "User does not exist"});
        }
        const isMatch = await bcrypt.compare(password , userExist.password);
        if(!isMatch){
            return res.status(400).json({msg: "Invalid credentials"});
        }
        const token = jwt.sign({id: userExist._id} , process.env.JWT_SECRET);
        delete userExist.password;
        res.status(200).json({token , userExist});
        
    } catch (err) {
        res.status(500).json({error : err.message});
    }
};