const express=require('express');
const router=express.Router();
const Coupon=require('../models/Coupon-Model');
const {createCoupon,getAllCoupons,getCoupon,updateCoupon,deleteCoupon}=require('../services/Coupon-service');
const {getCouponValidator,createCouponValidator,deleteCouponValidator,updateCouponValidator}=require('../utils/validators/CouponValidator.js')
const {allowedTo,protect}=require('../services/Auth-service')


router.use(protect,allowedTo('admin','manager'))

router.route('/')
       .post(createCouponValidator,createCoupon)
       .get(getAllCoupons)

router.route('/:id')
    .get(getCouponValidator,getCoupon)
    .put(updateCouponValidator,updateCoupon)
    .delete(deleteCouponValidator,deleteCoupon)

     

module.exports=router;