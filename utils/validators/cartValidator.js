const {validatorMiddleware}=require('../../middlewares/validatorMiddleware')
const {check}=require('express-validator')

exports.addToCartValidator=[
    check('productId').notEmpty().withMessage('Product is required').isMongoId().withMessage("Invalid ID"),
    check('color').notEmpty().withMessage('color is required'),
    validatorMiddleware
] 

exports.removeItemValidator=[
    check('id').notEmpty().withMessage("Cart item ID is required").isMongoId().withMessage("Invalid ID"),
    validatorMiddleware
] 

exports.updateCartItemQuantityValidator=[
    check('id').notEmpty().withMessage("Cart item ID is required").isMongoId().withMessage("Invalid ID"),
    validatorMiddleware
]