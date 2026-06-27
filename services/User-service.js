const User = require("../models/User-Model");
let slugify = require("slugify");
const asynchandler = require("express-async-handler");
const factory = require("./handlersFactory.js");
const customError = require("../utils/customer-error.js");
const ApiFeatures = require("../utils/apiFeatures.js");
const { uploadOneImage } = require("../middlewares/uploadImageMiddleware.js");
const {v4:uuidv4 } =require ("uuid");
const sharp = require('sharp');
const uploadUser = uploadOneImage("profilePicture");
const bycrypt= require('bcryptjs')
const jwt= require('jsonwebtoken')
const createToken= (id)=>{
  return jwt.sign({userId:id},process.env.SECRET_KEY,{expiresIn:process.env.EXPIRES_IN
   })}
const resizeUser=asynchandler(async(req,res,next)=>{
    const filename=`User-${uuidv4()}-${Date.now()}.jpeg`;
    if(req.file){
    await sharp(req.file.buffer).resize({width:600,height:600,fit:'fill'}).toFormat('jpeg').jpeg({quality:95}).toFile(`uploads/Users/${filename}`)
    req.body.profilePicture=filename;}
    next()
})

const createUser = factory.create(User);

const getAllUsers = factory.getAll(User);

const getUser = factory.getOne(User);

const updateUser =   asynchandler(async (req, res, next) => {
    const { id } = req.params;
    const{name,email,phoneNumber,profilePicture,role}=req.body;
    const document = await User.findOneAndUpdate(
      { _id: id },
      {
        name,
        email,
        phoneNumber,
        profilePicture,
        role
      },
      { new: true },
    );
    if (!document) {
      return next(new customError("The document is not found", 404));
    }
    res.status(200).json({ status: "success", data: document });
  })

  const changePassword=asynchandler(async (req,res,next)=>{
    const {id}=req.params;
    const user=await User.findOneAndUpdate({_id:id},{password:await bycrypt.hash(req.body.newPassword,12),passwordChangedAt:Date.now()},{new:true});
    res.status(200).json({status:'success',data:user});
  })


const deleteUser = factory.deleteOne(User);



const getUserLoggedData=asynchandler(async (req,res,next)=>{
  console.log(req.user._id)
  req.params.id=req.user._id
  next();
})


const updateUserPassword=asynchandler(async (req,res,next)=>{
   const id=req.user._id;
     const user=await User.findOneAndUpdate({_id:id},{password:await bycrypt.hash(req.body.newPassword,12),passwordChangedAt:Date.now()},{new:true});
     const token = createToken(id);
     res.status(200).json({status:'success',token,data:user});
})



const updateUserLoggedData=asynchandler(async(req,res,next)=>{
  const user= await User.findOneAndUpdate({_id:req.user._id},{
    name:req.body.name,
    email:req.body.email,
    phoneNumber:req.body.phoneNumber,
    profilePicture:req.body.profilePicture
  },{new:true});

  res.status(200).json({status:"success",data:user})
})


const deleteUserLoggedData=asynchandler(async(req,res,next)=>{
  const id= req.user._id;
  await User.findOneAndDelete({_id:id});
  res.status(204).json({status:"success"})
})
module.exports = {
  createUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  uploadUser,
  resizeUser,
  changePassword,
  getUserLoggedData,
  updateUserLoggedData,
  updateUserPassword,
  deleteUserLoggedData
};
