const customError = require("../utils/customer-error.js");
const asynchandler = require("express-async-handler");
const User = require("../models/User-Model");
const {sendEmail}=require('../utils/sendEmail.js')
const crypto = require('crypto')
var jwt = require('jsonwebtoken');
const bycrypt= require('bcryptjs')
const createToken= (id)=>{
  return jwt.sign({userId:id},process.env.SECRET_KEY,{expiresIn:process.env.EXPIRES_IN
   })
}
exports.signUp= asynchandler((async(req,res,next)=>{
    const {name,email,password,confirmPassword}=req.body;
    const user =await User.create({
        name,
        email,
        password,
        confirmPassword
    });
    
let token=createToken(user._id);
res.status(201).json({status:"success",token,data:user})
    

}))

exports.login=asynchandler(async(req,res,next)=>{
    const{email,password}=req.body;
   const user=await User.findOne({email});
   if(!user || ! await bycrypt.compare(password,user.password)){
     return next(new customError("Email or password is incorrect",401));
   }
   let token =createToken(user._id);
   res.status(200).json({status:'success',token,user});

});

exports.protect= asynchandler(async (req,res,next)=>{
      // 1) Check if token exist, if exist get
      let token;
      if(req.headers.authorization){
          token=req.headers.authorization.split(" ")[1];
      }
      if(!token){
        return next(new customError("You are not login, Please login to get access this route",401))
      }

       // 2) Verify token (no change happens, expired token)
       const decoded= jwt.verify(token,process.env.SECRET_KEY);
       

         // 3) Check if user exists 
         const user= await User.findById(decoded.userId);
         if(!user){
            return(new customError("User doesn't exist"))
         };

  // 4) Check if user change his password after token created
  if(user.passwordChangedAt){
    if(Math.floor(user.passwordChangedAt.getTime()/1000)>decoded.iat){
        return next(new customError("User recently changed his password. please login again..",401))
    }}
    req.user=user;
    next();
})


exports.allowedTo= (...roles)=>asynchandler(async(req,res,next)=>{
  if(!roles.includes(req.user.role)){
 return next( new customError('You are not allowed to access this route', 403))
}
next();
})


exports.forgetPassword=asynchandler(async(req,res,next)=>{
  const {email}=req.body;
  const user = await User.findOne({email});
  if(!user){
    return next(new customError("User doesn't exist",404));
  }
  //generate a reset code 
  const resetCode=Math.floor(100000 + Math.random() * 900000).toString();;
  //hash the reset code
  const hashedResetCode=crypto.createHash('sha256').update(resetCode).digest('hex');
  user.resetCode=hashedResetCode;
  //put the expiration of the reset code
  const expiresIn=Date.now()+10*60*1000;
  user.passwordExpiresIn=expiresIn;
  user.passwordResetVerified=false
  await user.save();

//send an email
  const message=`Hi ${user.name},\n We received a request to reset the password on your E-shop Account. \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n The E-shop Team`;

try{
  await sendEmail({email,message,subject:"Your password reset code (valid for 10 min)"})
}
catch(err){
  user.resetCode=undefined;
  user.passwordExpiresIn=undefined;
  user.passwordResetVerified=undefined;
  
  await user.save();
  return next(new customError('There is an error in sending email', 500));
}
res.status(200).json({ status: 'Success', message: 'Reset code sent to email' });

});


exports.verifyResetCode= asynchandler(async (req,res,next)=>{
  const {resetCode}=req.body;
  const resetHashedCode=crypto.createHash('sha256').update(resetCode).digest('hex');
  const user= await User.findOne({
    resetCode:resetHashedCode,
    passwordExpiresIn:{$gt:Date.now()}
  })
  if(!user){
    return next(new customError("Reset code invalid or expired",400))
  };

  user.passwordResetVerified=true;
  await user.save();
  res.status(200).json({status:'success',data:"User is verified successfully"})
})

exports.resetPassword= asynchandler(async (req,res,next)=>{
  const {email,newPassword}=req.body;
  const user= await User.findOne({email});
  if(!user){
    return next(new customError("User doesn't exist",404))
  }
  if(!user.passwordResetVerified){
    return next(new customError("Reset Code is not verified",400))
  }
   user.password=newPassword;

   user.passwordChangedAt=undefined

   user.passwordExpiresIn=undefined

   user.passwordResetVerified=undefined
  
   await user.save();
   const token=createToken(user._id)
   res.status(200).json({status:'success',token,data:'password is reset successfully'})
})

