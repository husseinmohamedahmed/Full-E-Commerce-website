const express=require('express');
const router=express.Router();
const User=require('../models/User-Model');
const {check,validationResult}=require('express-validator')
const {allowedTo,protect}=require('../services/Auth-service');
const {addAddress,removeAddress,getLoggedUserAddresses}=require('../services/Address-service');
const {addAddressValidator,removeAddressValidator}=require('../utils/validators/addressValidator')
router.route('/')
    .put(protect,allowedTo('user'),addAddressValidator,addAddress)
    .get(protect,allowedTo('user'),getLoggedUserAddresses)
router.delete('/:id',protect,allowedTo('user'),removeAddressValidator,removeAddress)


     

module.exports=router;