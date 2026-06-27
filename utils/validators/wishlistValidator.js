const {validatorMiddleware}=require('../../middlewares/validatorMiddleware')
const {check}=require('express-validator');
const customError=require("../customer-error");

exports.addToWishlistValidator=[
    check('product').notEmpty().withMessage('Product is required').isMongoId().withMessage('Invalid format'),
    validatorMiddleware
]

exports.removeFromWishlistValidator=[
        check('id').notEmpty().withMessage('Product ID is required').isMongoId().withMessage('Invalid ID'),
        validatorMiddleware
]