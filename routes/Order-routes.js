const {allowedTo,protect}=require('../services/Auth-service')
const {createCashOrder,getAllOrders,getSpecificOrder,filterObject,updateOrderToPaid,updateOrderToDelivered,checkOutSession}= require('../services/Order-service');
const express=require('express');
const router=express.Router();
const{getSpecificOrderValidator,updateOrderStatusValidator}=require('../utils/validators/orderValidator')



router.route('/')
      .post(protect,allowedTo('user'),createCashOrder)
      .get(protect,allowedTo('user','admin','manager'),filterObject,getAllOrders)
router.route('/:id')
     .get(protect,allowedTo('admin','manager','user'),getSpecificOrderValidator,getSpecificOrder)
router.put('/:id/updateToPaid',protect,allowedTo('admin'),updateOrderStatusValidator,updateOrderToPaid)
router.put('/:id/updateToDelivered',protect,allowedTo('admin'),updateOrderStatusValidator,updateOrderToDelivered)
router.get( '/checkout-session/:cartID',protect,allowedTo('user'),checkOutSession)
module.exports=router