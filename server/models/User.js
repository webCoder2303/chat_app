import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required
    },
    fullName:{
        type:String,
        required,
        minlength:6
    },
    password:{
        type:String,
        required,
        minlength:6
    },
    profilePic:{
        type:String,
        default:""
    },
    bio:{
        type:String
     }
},{timestamps:true})


const User = mongoose.model("User",userSchema)

export default User