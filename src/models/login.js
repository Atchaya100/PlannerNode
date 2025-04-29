const mongoose=require('mongoose')
const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    photoUrl:{
        type:String,
        required:true
    },
    createdat:{
        type:String,
        required:true
    }
},
{
    collection:"signup"
});
module.exports=mongoose.model("signup",userSchema);