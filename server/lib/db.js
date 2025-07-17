import mongoose from "mongoose";

export const connectDB = async()=>{
    try {
        mongoose.connection.on("Connected",()=>console.log("Database Connected"))
        await mongoose.connect(`${process.env.MONGO_URI}/chat-app`)
    } catch (error) {
        console.log(error);
    }
}