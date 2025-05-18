const express = require("express");
const router = express.Router();

const loginController = require('../controllers/loginController'); 
const taskController = require('../controllers/taskController')

// Define the route to get a user by ID 
router.post('/checkUser', loginController.checkuser); 
router.post('/createUser', loginController.createUser); 
router.post('/logout', loginController.logout); 
router.post('/createTask',taskController.createTask)
router.post('/bulkInsert',taskController.saveBulkTask)
router.post('/getTask',taskController.getTask)
router.post('/updateTask',taskController.updateTask)
router.post('/savePlan',taskController.createPlan)
router.post('/getPlans',taskController.getPlans)


module.exports = router;
