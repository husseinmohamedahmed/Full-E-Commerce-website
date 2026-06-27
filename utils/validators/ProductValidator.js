const {validatorMiddleware}=require("../../middlewares/validatorMiddleware")
const {check}=require("express-validator");
const Category=require('../../models/Category-Model');
const subCategory=require('../../models/subCategory-Model')
let slugify=require('slugify')
exports.getProductValidator=[
    check("id").notEmpty().withMessage("ID is required").isMongoId().withMessage("Invalid ID"),
    validatorMiddleware
    
]   

exports.deleteProductValidator=[
    check("id").notEmpty().withMessage("ID is required").isMongoId().withMessage("Invalid ID"),validatorMiddleware
]


exports.updateProductValidator=[
    check("id").notEmpty().withMessage("ID is required").isMongoId().withMessage("Invalid ID"),check("price").optional().toFloat().isFloat({max:3000000}).withMessage("Too long product's price"),
     check('title').optional().custom((value,{req})=>{
             req.body.slug=slugify(req.body.title);
             return true;
         })
    ,validatorMiddleware
]
 

exports.createProductValidator=[
    check("title").notEmpty().withMessage("Title is required").isLength({min:3}).withMessage("Too short title").isLength({max:100}).withMessage("too long title").custom((value,{req})=>{
           req.body.slug=slugify(value);     return true;
        }),
    check("description").notEmpty().withMessage("Description is required").isLength({min:20}).withMessage("Too short description"),
    check("quantity").notEmpty().withMessage("Quantity is required").isNumeric().withMessage("Product's quantity should be a number"),
    check("sold").optional().isNumeric().withMessage("Product's quantity should be a number").isLength({max:30}).withMessage("Too long product's price"),
    check("price").notEmpty().withMessage("Product's's price is required").isNumeric("Product's price must be a number").toFloat().isFloat({max:3000000}).withMessage("Too long product's price"),
    check("priceAfterDiscount").optional().isNumeric("Product's price must be a number").toFloat().custom((value,{req})=>{
        if(value>=req.body.price){
            throw new Error("Price after discount should be less than the original price");
        }
        return true
    }),
    check('colors').optional().isArray().withMessage("Product's colors should be an array"),
    check("imageCover").notEmpty().withMessage("Product's cover image is required"),
    check("images").optional().isArray().withMessage("Product's subcategories should be an array"),
    check('category').notEmpty().withMessage("Product's category is required").isMongoId().withMessage("Invalid ID").custom(async (value)=>{
        const category=await Category.findById(value)
        if(!category){
                 throw new Error('Invalid category');
        }
        return true; 
    }).withMessage('Invalid category'),
    check('subcategories').optional().isArray().withMessage("Product's subcategories should be an array").isMongoId().withMessage("Invalid ID").custom(async (subcategories)=>{
        Subcategories= await subCategory.find({_id:{$exists:true,$in:subcategories}});
        if(Subcategories.length!=subcategories.length){
            throw new Error("Invalid subcategories")
        }
        return true;
    }).custom(async (subcategories,{req})=>{
        const subcategoryOfCateogryInBody=await subCategory.find({category:req.body.category});
        let subcategoryOfCateogryInBodyID=[];
        subcategoryOfCateogryInBody.forEach((subcategory)=>{
            subcategoryOfCateogryInBodyID.push(subcategory._id.toString());
        });

      if( ! subcategories.every((value)=>{
           return subcategoryOfCateogryInBodyID.includes(value);
        })){
            throw new Error("The subcategories don't belong to the category")
        }
        return true
}),
    check('brand').optional().isMongoId().withMessage('Brand ID is required'),
    check('ratingsAverage').optional().isNumeric().withMessage("Rating's average should be a number").isLength({min:1}).withMessage("Product's rating must be equal or above 1").isLength({max:5}).withMessage("Product's rating must be equal or below 5"),
    check('ratingsQuantity').optional().isNumeric().withMessage("Product's rating quantity should be a number"),
    validatorMiddleware
]
