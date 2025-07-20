import { generateToken } from "../lib/utils";
import User from "../models/User";
import bcrypt from "bcryptjs"
export const signup =async(req,res) =>{
    const {fullName,email,password,bio} = req.body;
    try {
        if(!fullName||!email||!password||!bio){
            return res.json({success:false,message:"Missing details"})
        }
        const user = await User.findOne({email});
        if(user){
            return res.json({success:false,message:"Account already existed"})
        }
        const password = await bcrypt.hash(password,10);
        const newUser = await User.create({fullName,email,password,bio}) 
        const token = generateToken(newUser._id)
        res.json({success:true,userData:newUser,token,message:"Account created Successfully"})
    } catch (error) {
        console.log(error.message)
        res.json({success:false,message:error.message})

    }
}
