const {validatorMiddleware}=require('../../middlewares/validatorMiddleware')
const {check}=require('express-validator')
const Review=require('../../models/Review-Model')
const customError= require('../customer-error')
exports.getReviewValidator=[
    check('id').isMongoId().withMessage('Invalid ID'),
    validatorMiddleware
]

exports.createReviewValidator=[
    check('title').optional(),check('rating').notEmpty().withMessage("Rating is required").isFloat({min:1,max:5})
    .withMessage("Rating value should be between 1 and 5"),check('product').notEmpty().isMongoId().withMessage('Product is required').custom(async (value,{req})=>{
        const review=await Review.findOne({user:req.user._id,product:req.body.product})
      
        if(review){
            throw new customError('User has already made a review on this product',400)
        }
        return true;
    }),
    validatorMiddleware
]

exports.deleteReviewValidator=[
    check('id').isMongoId().withMessage('Invalid ID').custom(async (value,{req})=>{
        if(req.user.role=='user'){
        const review = await Review.findOne({_id:value});
        if(!review){
            throw new customError("This review doesn't exist",404);
        }
        if(review.user._id.toString()!=req.user._id.toString()){
            throw new customError('Cannot edit other users reviews',400);
        }}
        return true
    }),validatorMiddleware
]

exports.updateReviewValidator=[
    check('id').notEmpty().withMessage('Review ID is required').isMongoId().custom(async (value,{req})=>{
        const review = await Review.findOne({_id:value});
        if(!review){
            throw new customError("This review doesn't exist",404);
        }
        if(review.user._id.toString()!=req.user._id.toString()){
            throw new customError('Cannot edit other users reviews',400);
        }
        return true
    }),check('rating').optional().isFloat({min:1,max:5})
    .withMessage("Rating value should be between 1 and 5"),
    validatorMiddleware
]