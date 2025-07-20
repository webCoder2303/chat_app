//Middleware to protect routes

import { jwt } from "jsonwebtoken";
import User from "../models/User";
import cloudinary from "../lib/cloudinary";

export const protectRoute = async(req,res,next)=>{
    try {
        const token = req.headers.token;
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        const user = await User.findById(decoded.userId).select("-password")
        if(!user) return res.json({success:false,message:"User not found"})
        req.user  = user;
        next()
    } catch (error) {
        console.log(error.message)
        res.json({success:false,message:error.message})

    }
}

export const checkAuth = (req,res)=>{
    res.json({success:true,user:req.user});
    
}


export const updateProfile = async(req,res)=>{
    try {
        const {profilePic,bio,fullName} = req.body;
        const userId = req.user._id
        let updatedUser;
        if(!profilePic){
           updatedUser =  await User.findByIdAndUpdate(userId,{bio,fullName},{new:true})
        }
        else{
            const upload = await cloudinary.uploader.upload(profilePic);
            updatedUser = await User.findByIdAndUpdate(userId,{profilePic: upload.secure_url,bio,fullName},{new:true});
        }
        res.json({success:true,user:updatedUser})
    } catch (error) {
        console.log(error.message)
        res.json({success:false,message:error.message})
    }
}
