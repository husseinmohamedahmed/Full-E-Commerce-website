const {validatorMiddleware}=require('../../middlewares/validatorMiddleware')
const {check}=require('express-validator')
let slugify=require('slugify')
exports.getCategoryValidator=[
    check('id').isMongoId().withMessage('Invalid ID'),
    validatorMiddleware
]

exports.createCategoryValidator=[
    check('name').notEmpty().withMessage('Category required').isLength({min:3}).withMessage('Too short category name').isLength({max:32}).withMessage('Too long category name').custom((value,{req})=>{
           req.body.slug=slugify(value);     return true;
        }),
    validatorMiddleware
]

exports.deleteCategoryValidator=[
    check('id').isMongoId().withMessage('Invalid ID'),validatorMiddleware
]

exports.updateCategoryValidator=[
    check('id').isMongoId().withMessage('Invalid ID'),check('name').optional().custom((value,{req})=>{
            req.body.slug=slugify(req.body.name);
            return true;
        }),validatorMiddleware
]