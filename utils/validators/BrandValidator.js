const {validatorMiddleware}=require('../../middlewares/validatorMiddleware')
const {check}=require('express-validator')
let slugify=require('slugify')
exports.getBrandValidator=[
    check('id').isMongoId().withMessage('Invalid ID'),
    validatorMiddleware
]

exports.createBrandValidator=[
    check('name').notEmpty().withMessage('Brand required').isLength({min:3}).withMessage('Too short Brand name').isLength({max:32}).withMessage('Too long Brand name').custom((value,{req})=>{
       req.body.slug=slugify(value);     return true;
    }),
    validatorMiddleware
]

exports.deleteBrandValidator=[
    check('id').isMongoId().withMessage('Invalid ID'),validatorMiddleware
]

exports.updateBrandValidator=[
    check('id').isMongoId().withMessage('Invalid ID'),check('name').optional().custom((value,{req})=>{
        req.body.slug=slugify(req.body.name);
        return true;
    }),validatorMiddleware
]