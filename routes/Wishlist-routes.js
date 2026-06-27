const express=require('express');
const router=express.Router();
const User=require('../models/User-Model');
const {check,validationResult}=require('express-validator')
const {allowedTo,protect}=require('../services/Auth-service');
const {addToWishlist,removeFromWishlist,getLoggedUserWishlist}=require('../services/Wishlist-service');
const {addToWishlistValidator,removeFromWishlistValidator}=require('../utils/validators/wishlistValidator.js')
router.route('/')
    .put(protect,allowedTo('user'),addToWishlistValidator,addToWishlist)
    .get(protect,allowedTo('user'),getLoggedUserWishlist)
router.delete('/:id',protect,allowedTo('user'),removeFromWishlistValidator,removeFromWishlist)


     

module.exports=router;