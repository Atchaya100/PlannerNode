const taskModel = require("../models/tasks"); // Importing the loginModel where findUserById is defined
const validate = require("../services/commonService");
const config = require("../middlewares/authMiddleware");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "atchu2659";
const JWT_EXPIRES_IN = "1h";
const planModel = require("../models/plans"); 
const taskJson=taskModel;
const planJson=planModel;

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
        const result=await newTask.save();
        res.status(200).json({res:result,msg:"success"})
    }
    catch(e){
        res.status(400).json({res:e})
    } 
};

const saveBulkTask = async(req,res)=>{
    try{
        if (!req.session.user) {
        return res.status(401).send({ res: "Unauthorized" });
    }
        let tasks = req.body.tasks
        let data=[]
        tasks.map((item)=>{
            let task={
                userid:req.session.user.id,
                tasks:item.tasks,
                startTime:item.startTime,
                type:item.type,
                goal:item.planid,
                resources:item.resources,
                endTime:item.endTime,
                createdat:new Date(),
                createdBy:req.session.user.name,
                status:'Pending',
                date:item.date
            }
            data.push(task)
        })
        const result=await taskModel.insertMany(data);
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

const createPlan = async(req,res)=>{
  if (!req.session.user) {
        return res.status(401).send({ res: "Unauthorized" });
    }
  const {plan,description,start,end} = req.body
  try{
    let object = {plan,description,start,end};
    let newTask=new planJson({
        userid:req.session.user.id,
        plan:req.body.plan,
        description:req.body.description,
        start:req.body.start,
        end:req.body.end,
        
    })
    let valid = validate.validateFields(object);
    if (!valid.isValid) {
        return res.status(400).json({message: "Fields Missing"});
    }
    try{
        const result=await newTask.save();
        res.status(200).json({res:result,msg:"success"})
    }
    catch(e){
        res.status(400).json({res:e})
    } 
  }
  catch(e){
      res.status(400).json({res:e,msg:"error"})
  }
}

const updateTask = async (req, res) => {
    const { id, task, status, resources } = req.body.task;
  
    if (!req.session.user) {
      return res.status(401).json({ msg: "Unauthorized" });
    }
  
    if (!id || !task) {
      return res.status(400).json({ msg: "Missing required fields: id or task" });
    }
  
    try {
      const updatedTask = await taskModel.findOneAndUpdate(
        { _id: id, userid: req.session.user.id },
        {
          $set: {
            tasks: task.trim(),
            status: status || "Pending",
            resources: resources || [],
          },
        },
        { new: true }
      );
  
      if (!updatedTask) {
        return res.status(404).json({ msg: "Task not found or access denied" });
      }
  
      res.status(200).json({ res: updatedTask, msg: "success" });
    } catch (error) {
      res.status(500).json({ msg: "Error updating task", error });
    }
  };

  const getPlans = async (req,res)=>{
    if (!req.session.user) {
        return res.status(401).send({ res: "Unauthorized" });
    }
    try{
        const result=await planModel.find({userid:req.session.user.id});
        const task=await taskModel.find({userid:req.session.user.id});
        res.status(200).json({plan:result,msg:"success",tasks:task})
    }
    catch(e){
        res.status(400).json({res:e,msg:"error"})
    }
}
  



// Export the controller method
module.exports = {
    createTask,getTask,saveBulkTask,updateTask,createPlan,getPlans
};
