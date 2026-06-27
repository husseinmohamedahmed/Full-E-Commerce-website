const express=require('express');
const router=express.Router({mergeParams:true});
const Review=require('../models/Review-Model');
const {check,validationResult}=require('express-validator')
const {createReview,getAllReviews,getReview,updateReview,deleteReview,resizeReview,uploadReview,assignProductId,findObjectAssign}=require('../services/Reviews-Service');
const {getReviewValidator,createReviewValidator,deleteReviewValidator,updateReviewValidator}=require('../utils/validators/reviewsValidator')
const {allowedTo,protect}=require('../services/Auth-service');

router.route('/')
    .post(protect,allowedTo('user'),assignProductId,createReviewValidator,createReview)
    .get(findObjectAssign,getAllReviews)

router.route('/:id')
    .get(getReviewValidator,getReview)
    .put(protect,allowedTo('user'),assignProductId,updateReviewValidator,updateReview)
    .delete(protect,allowedTo('user','admin','manager'),deleteReviewValidator,deleteReview)

     


module.exports=router;