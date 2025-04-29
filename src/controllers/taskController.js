const taskModel = require("../models/tasks"); // Importing the loginModel where findUserById is defined
const validate = require("../services/commonService");
const config = require("../middlewares/authMiddleware");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "atchu2659";
const JWT_EXPIRES_IN = "1h";
const taskJson=taskModel;

const createTask = async(req, res) => {
    const {title, start, end,date} = req.body;
    if (!req.session.user) {
        return res.status(401).send({ res: "Unauthorized" });
    }
    let object = {title,start,end,date};
    let newTask=new taskJson({
        userid:req.session.user.id,
        tasks:req.body.title,
        startTime:req.body.start,
        type:req.body.type,
        endTime:req.body.end,
        createdat:new Date(),
        createdBy:req.session.user.name,
        status:'Pending',
        date:req.body.date
    })
    let valid = validate.validateFields(object);
    if (!valid.isValid) {
        return res.status(400).json({message: "Fields Missing"});
    }
    try{
        console.log(newTask)
        const result=await newTask.save();
        res.status(200).json({res:result,msg:"success"})
    }
    catch(e){
        res.status(400).json({res:e})
    } 
};

const saveBulkTask = async(req,res)=>{
    try{
        let tasks = req.body.tasks
        let data=[]
        console.log(tasks)
        tasks.map((item)=>{
            let task={
                userid:req.session.user.id,
                tasks:item.tasks,
                startTime:item.startTime,
                type:item.type,
                endTime:item.endTime,
                createdat:new Date(),
                createdBy:req.session.user.name,
                status:'Pending',
                date:item.date
            }
            data.push(task)
        })
        const result=await taskModel.insertMany(data);
        console.log(result)
        res.status(200).json({res:result,msg:"success"})
    }
    catch(e){
        console.log(e)
        res.status(400).json({res:e})
    } 
}

const getTask = async (req,res)=>{
    const {start,end} = req.body;
    if (!req.session.user) {
        return res.status(401).send({ res: "Unauthorized" });
    }
    try{
        const result=await taskModel.find({userid:req.session.user.id,date: {
            $gte: new Date(start),
            $lte: new Date(end)
          }});
        res.status(200).json({res:result,msg:"success"})
    }
    catch(e){
        res.status(400).json({res:e,msg:"error"})
    }
}


// Export the controller method
module.exports = {
    createTask,getTask,saveBulkTask
};
