const express=require('express');
const router=express.Router();
const User=require('../models/User-Model');
const {uploadOneImage}=require('../middlewares/uploadImageMiddleware')
const {check,validationResult}=require('express-validator')
const {createUser,getAllUsers,getUser,updateUser,deleteUser,resizeUser,uploadUser,changePassword,getUserLoggedData,updateUserPassword,updateUserLoggedData,deleteUserLoggedData}=require('../services/User-service');
const {getUserValidator,createUserValidator,deleteUserValidator,updateUserValidator,changePasswordValidator,updatePasswordValidator,updateUserLoggedDataValidator}=require('../utils/validators/UserValidator')
const {allowedTo,protect}=require('../services/Auth-service')
router.route('/')
    .post(protect,allowedTo('admin'),uploadUser,resizeUser,createUserValidator,createUser)
    .get(protect,allowedTo('admin'),getAllUsers)

router.get('/getMe',protect,getUserLoggedData,getUser);
router.put('/updatePassword',protect,updatePasswordValidator,updateUserPassword);
router.put('/updateUserData',protect,uploadUser,resizeUser,updateUserLoggedDataValidator,updateUserLoggedData)
router.delete('/deleteUser',protect,deleteUserLoggedData)
router.route('/:id')
    .get(protect,allowedTo('admin'),getUserValidator,getUser)
    .put(protect,uploadUser,resizeUser,updateUserValidator,updateUser)
    .delete(protect,allowedTo('admin'),deleteUserValidator,deleteUser)

router.route('/changePassword/:id')
    .put(changePasswordValidator,changePassword)     



module.exports=router;