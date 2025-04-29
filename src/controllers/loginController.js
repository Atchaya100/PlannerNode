const loginModel = require("../models/login"); // Importing the loginModel where findUserById is defined
const validate = require("../services/commonService");
const config = require("../middlewares/authMiddleware");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "atchu2659";
const JWT_EXPIRES_IN = "1h";
const LoginJson=loginModel;

const getUserById = (req, res) => {
    const userId = req.params.id;
    loginModel.findUserById(userId, (err, user) => {
        if (err) {
            return res.status(500).json({message: "Error fetching user", error: err});
        }
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }
        res.status(200).json(user);
    });
};

const createUser = async(req, res) => {
    const {email, firstName, lastName, photoUrl} = req.body;
    let object = {email, firstName, lastName, photoUrl};
    let newUser=new LoginJson({
        email:req.body.email,
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        photoUrl:req.body.photoUrl,
        createdat:new Date()
    })
    let valid = validate.validateFields(object);
    if (!valid.isValid) {
        return res.status(400).json({message: "Fields Missing"});
    }
    try{
        const result=await newUser.save();
        res.status(200).json({res:result})
    }
    catch(e){
        res.status(400).json({res:e})
    }    
};

const checkuser = async (req, res) => {
    const email = req.body.email;
    try {
        const u = await loginModel.findOne({email: email});
        if (!u) {
            return res.status(404).json({ res: "Not Found" }); 
        }
        req.session.user = {
            id: u._id,
            name: u.firstName,
            email: u.email
        };
        res.status(200).json({res:u});
    } catch (e) {
        res.status(500).json({res:"Error"})
    }
};

const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error destroying session:", err);
            return res.status(500).send({ message: "Logout failed" });
        }
        res.clearCookie('connect.sid'); // Remove session cookie
        res.status(200).send({ message: "Logged out successfully" });
    });
};

// Export the controller method
module.exports = {
    getUserById,logout,
    createUser,
    checkuser
};
