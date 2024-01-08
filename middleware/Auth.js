const RoleModel = require("../models/RoleModel");
const MemberModel = require("../models/MemberModel");
const UserModel = require("../models/UserModel");
const { validateActivationToken } = require("../utils/token");

const isAdmin = async (req,res,next) => {
    const { role }=req.body;
    if(!role) return res.status(400).json({status:false, error:"NOT_ALLOWED_ACCESS" });

    const get=await RoleModel.find({_id:role});

    if(get[0].name!="Community Admin") return res.status(400).json({status:false, error:"NOT_ALLOWED_ACCESS" });

    next();
    
}
const isAdminandModerator= async (req,res,next) => {
    const memberId=req.params.id;
    
    const val=await MemberModel.find({_id:memberId}).populate({
        path:'community',
        select:"owner"
    });

    const cookieToken=req.cookies.authorization;
    const token = cookieToken? cookieToken: req.headers['authorization'];
    const { email } = validateActivationToken(token);

    const {_id}=await UserModel.findOne({email});
    
    if(!val || val.length==0 || val[0].community.owner!=_id) return res.status(400).json({status:false, error:"NOT_ALLOWED_ACCESS" });

    next();
    
}
const validUser=async(req,res,next)=>{
    const cookieToken=req.cookies.authorization;
    const token = cookieToken? cookieToken: req.headers['authorization'];

    const { email } = validateActivationToken(token);

    const user=await UserModel.findOne({email});
    if(!user) return res.status(400).json({status:false, error:"Not valid user" });
    next();
}

module.exports={
    isAdmin,
    isAdminandModerator,
    validUser
}