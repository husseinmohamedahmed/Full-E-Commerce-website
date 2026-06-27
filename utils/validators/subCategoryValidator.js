const{check}=require('express-validator')
const {validatorMiddleware}=require('../../middlewares/validatorMiddleware')
let slugify=require('slugify')
exports.createSubCategoryValidator=[
  check('name').notEmpty().withMessage('Subcategory required').isLength({min:2}).withMessage('Too short Subcategory name').isLength({max:32}).withMessage('Too long Subcategoryname').custom((value,{req})=>{
         req.body.slug=slugify(value);
         return true;
      }),
  check('category').notEmpty().withMessage('Category is required'),
  validatorMiddleware
]

exports.getSubCategoryValidator=[
        check('id').notEmpty().withMessage('ID is required').isMongoId().withMessage('Invalid ID'),
         validatorMiddleware
] 

exports.updateSubCategoryValidator=[
        check('id').notEmpty().withMessage('ID is required').isMongoId().withMessage('Invalid ID'),check('name').optional().custom((value,{req})=>{
                req.body.slug=slugify(req.body.name);
                return true;
            }),
         validatorMiddleware
] 

exports.deleteSubCategoryValidator=[
        check('id').notEmpty().withMessage('ID is required').isMongoId().withMessage('Invalid ID'),
         validatorMiddleware
] 