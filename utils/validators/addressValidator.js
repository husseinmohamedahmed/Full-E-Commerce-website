const {validatorMiddleware}=require('../../middlewares/validatorMiddleware')
const {check}=require('express-validator');
const customError=require("../customer-error");

exports.addAddressValidator=[
    check('alias').notEmpty().withMessage('alias is required'),check('details').notEmpty().withMessage('details is required'),
    check('postalCode').notEmpty().withMessage('postalCode is required').isNumeric().withMessage('Postal code should be numeric'),
    check('phone').notEmpty().withMessage("Phone number is requried").isMobilePhone(['ar-EG', 'ar-SA'])
        .withMessage('Invalid phone number only accepted Egy and SA Phone numbers'),
    check('city').notEmpty().withMessage('City is required'),
    validatorMiddleware
]

exports.removeAddressValidator=[
       check('id').notEmpty().withMessage('Address ID is required').isMongoId().withMessage('Invalid ID')
]