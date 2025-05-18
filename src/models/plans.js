const mongoose=require('mongoose');
const { useLinkClickHandler } = require('react-router-dom');
const planSchema = new mongoose.Schema({
    plan:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    userid:{
        type:String,
        required:true
    },
    start:{
         type:String,
        required:true
    },
    end:{
        type:String,
        required:true
    }
},
{
    collection:"plans"
});
module.exports=mongoose.model("plans",planSchema);