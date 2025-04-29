const mongoose=require("mongoose");
const dotenv=require("dotenv")
dotenv.config();
const connectDb=async()=>{
    try{
        await mongoose.connect(process.env.MONGO);
        console.log("db connected");
    }
    catch(error){
        console.log(error)
    }
}
module.exports=connectDb
