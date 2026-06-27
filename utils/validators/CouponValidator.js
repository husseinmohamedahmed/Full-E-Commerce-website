const {validatorMiddleware}=require('../../middlewares/validatorMiddleware');
const {check}=require("express-validator");
const customError=require('../customer-error')
const Coupon=require('../../models/Coupon-Model')


exports.createCouponValidator=[
    check('name').notEmpty().withMessage("The coupon name is required").custom(async(name,{req})=>{
        const coupon= await Coupon.findOne({name});
        if(coupon){
           throw new customError("Duplicated coupon name",400)
        }
        return true;
    }),
    check('expireTime').notEmpty().withMessage("The expiration time is required").isDate().withMessage("Expiration time must be a date").custom((date,{req})=>{
        if(new Date(date).getTime()<Date.now()){
            throw new customError("The expiration date is invalid",400)
        }
        return true
    }),
    check('discount').notEmpty().withMessage("The discount value is required").isNumeric().withMessage("The discount value must be a number").isFloat({min:1}),
    validatorMiddleware
] 

exports.updateCouponValidator=[
    check('id').notEmpty().withMessage('ID is required').isMongoId().withMessage('Invalid ID'),
    check('name').optional().custom(async(name,{req})=>{
        const coupon= await Coupon.findOne({name});
        if(coupon && req.params.id!=coupon._id.toString()){
           throw new customError("Duplicated coupon name",400)
        }
        return true;
    }),
    check('expireTime').optional().isDate().withMessage("Expiration time must be a date").custom((date,{req})=>{
        if(new Date(date).getTime()<Date.now()){
            throw new customError("The expiration date is invalid",400)
        }
        return true
    }),
    validatorMiddleware
]

exports.deleteCouponValidator=[
    check('id').notEmpty().withMessage('ID is required').isMongoId().withMessage('Invalid ID'),
    validatorMiddleware
]
exports.getCouponValidator=[
    check('id').notEmpty().withMessage('ID is required').isMongoId().withMessage('Invalid ID'),
    validatorMiddleware
]