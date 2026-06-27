const {validatorMiddleware}=require('../../middlewares/validatorMiddleware')
const {check}=require('express-validator')
let slugify=require('slugify');
const User=require("../../models/User-Model");
const customError=require("../customer-error")
const bycrypt= require('bcryptjs')


exports.signUpValidator=[
    check('name').notEmpty().withMessage('Username is required').custom((value,{req})=>{
       req.body.slug=slugify(value);     
       return true;
    }),
    check('email').notEmpty().withMessage("User email is required").isEmail().withMessage("Invalid email address").custom(async (value,{req})=>{
        const user=await User.findOne({email:value});
        if(user){
            throw new customError("User already exists",400);
        }
        return true
    }),
    check('password').notEmpty().withMessage("User password is required").isLength({min:6}).withMessage("Password is at least 8 characters").isLength({max:32}).withMessage("Password maximum characters are 32 characters").custom((password,{req})=>{
        if(req.body.confirmPassword!=password){
         return   Promise.reject( new customError("Password and Confirm password don't match"))
        }
        return true;
    }),
    check('confirmPassword').notEmpty().withMessage("Confirm password is required"),
    validatorMiddleware
]

exports.loginValidator=[
    check('email').notEmpty().withMessage("User email is required").isEmail().withMessage("Invalid email address"),
    check('password').notEmpty().withMessage("User password is required").isLength({min:6}).withMessage("Password is at least 8 characters").isLength({max:32}).withMessage("Password maximum characters are 32 characters"),
    validatorMiddleware
]


exports.resetPassword=[
    
]