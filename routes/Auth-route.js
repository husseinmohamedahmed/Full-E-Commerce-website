const express=require('express');
const router=express.Router();
const {signUpValidator,loginValidator}=require("../utils/validators/authValidator");
const {signUp,login,forgetPassword,verifyResetCode,resetPassword}=require("../services/Auth-service");
const User=require('../models/User-Model');   


router.post('/signUp',signUpValidator,signUp); 
      

router.post('/login',loginValidator,login);


router.post('/forgetPassword',forgetPassword);


router.post('/verifyResetCode',verifyResetCode)


router.put('/resetPassword',resetPassword);


      


module.exports=router      