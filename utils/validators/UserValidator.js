const {validatorMiddleware}=require('../../middlewares/validatorMiddleware')
const {check}=require('express-validator')
let slugify=require('slugify');
const User=require("../../models/User-Model");
const customError=require("../customer-error")
const bycrypt= require('bcryptjs')
exports.getUserValidator=[
    check('id').isMongoId().withMessage('Invalid ID'),
    validatorMiddleware
]

exports.createUserValidator=[
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
    check('phoneNumber').notEmpty().withMessage("Phone number is requried").isMobilePhone(['ar-EG', 'ar-SA'])
    .withMessage('Invalid phone number only accepted Egy and SA Phone numbers'),
    validatorMiddleware
]

exports.deleteUserValidator=[
    check('id').isMongoId().withMessage('Invalid ID'),validatorMiddleware
]

exports.updateUserValidator=[
    check('id').isMongoId().withMessage('Invalid ID'),check('name').optional().custom((value,{req})=>{
        req.body.slug=slugify(req.body.name);
        return true;
    }), check('email').notEmpty().withMessage("User email is required").isEmail().withMessage("Invalid email address").custom(async (value,{req})=>{
        const user=await User.findOne({email:value});
        if(user){
            throw new customError("User already exists",400);
        }
        return true
    }),check('phoneNumber').notEmpty().withMessage("Phone number is requried").isMobilePhone(['ar-EG', 'ar-SA'])
    .withMessage('Invalid phone number only accepted Egy and SA Phone numbers'),
  validatorMiddleware
]


exports.changePasswordValidator=[
    check('currentPassword').notEmpty().withMessage("Current password is required").custom(async (currentPassword,{req})=>{
        const user = await User.findById(req.params.id);
        if(!user){
           throw new customError("User doesn't exist")
        }
        const isEqual= await bycrypt.compare(currentPassword,user.password);
         if(isEqual){
                return true;
            }
            throw new customError("Wrong user password",400)
        
    }),
    check('newPassword').notEmpty('New password is required').isLength({min:6}).withMessage("Password is at least 8 characters").isLength({max:32}).withMessage("Password maximum characters are 32 characters"),
    check('confirmNewPassword').notEmpty().withMessage("confirmation of the new password is required").custom((confirmpassword,{req})=>{
        if(confirmpassword===req.body.newPassword){
            return true
        }
        throw new customError("new password and the confirmation of the new passowrd don't match");
    }),
    validatorMiddleware
]
 
exports.updatePasswordValidator=[
   
        check('newPassword').notEmpty('New password is required').isLength({min:6}).withMessage("Password is at least 8 characters").isLength({max:32}).withMessage("Password maximum characters are 64 characters"),
        check('confirmNewPassword').notEmpty().withMessage("confirmation of the new password is required").custom((confirmpassword,{req})=>{
            if(confirmpassword===req.body.newPassword){
                return true
            }
            throw new customError("new password and the confirmation of the new passowrd don't match");
        }),
        validatorMiddleware
]


exports.updateUserLoggedDataValidator=[
    check('name').optional().custom((value,{req})=>{
       req.body.slug=slugify(value);     
       return true;
    }),
    check('email').optional().isEmail().withMessage("Invalid email address").custom(async (value,{req})=>{
        const user=await User.findOne({email:value});
        if(user){
            throw new customError("User already exists",400);
        }
        return true
    }),
  
    check('phoneNumber').optional().isMobilePhone(['ar-EG', 'ar-SA'])
    .withMessage('Invalid phone number only accepted Egy and SA Phone numbers'),
    validatorMiddleware
]
