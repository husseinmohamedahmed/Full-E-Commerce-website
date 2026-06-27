const {validatorMiddleware}=require('../../middlewares/validatorMiddleware');
const {check}=require("express-validator");
const customError=require('../customer-error')

exports.getSpecificOrderValidator=[
    check('id').notEmpty().withMessage("ID is required").isMongoId().withMessage('Invalid ID'),
    validatorMiddleware
]

exports.updateOrderStatusValidator=[
    check('id').notEmpty().withMessage("ID is required").isMongoId().withMessage('Invalid ID'),
    validatorMiddleware
]

