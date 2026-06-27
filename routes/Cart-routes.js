const express=require('express');
const router=express.Router();
const Cart=require('../models/Cart-Model');
const {check,validationResult}=require('express-validator')
const {allowedTo,protect}=require('../services/Auth-service');
const{addToCartValidator,removeItemValidator,updateCartItemQuantityValidator} =require('../utils/validators/cartValidator')
const {addToCart,getLoggedUserCart,removeItem,clearCart,updateCartItemQuantity,applyCoupon}=require('../services/Cart-service');
router.use(protect,allowedTo('user'))
router.route('/')
      .post(addToCartValidator,addToCart)
      .get(getLoggedUserCart)
      .delete(clearCart)

router.put('/applyCoupon',applyCoupon)


router.route('/:id')
      .delete(removeItemValidator,removeItem)
      .put(updateCartItemQuantityValidator,updateCartItemQuantity)

module.exports=router;