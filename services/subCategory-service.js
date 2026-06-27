const expressAsyncHandler = require('express-async-handler');
const subCategory=require('../models/subCategory-Model');
const asynchandler=require('express-async-handler')
const customError=require('../utils/customer-error')
const ApiFeatures=require('../utils/apiFeatures.js')
const factory=require('./handlersFactory.js');
let slugify=require('slugify');

const assignSubCategory=(req,res,next)=>{
    if(!req.body.category){
        req.body.category=req.params.id;
    }
    next();
}
const findObjectAssign= asynchandler(async(req,res,next)=>{
    const categoryId=req.params.id
    
    if(categoryId){
        req.findObject={category:categoryId};
    }
    next();
})
const createSubCategory=factory.create(subCategory)
const getAllsubCategories=factory.getAll(subCategory)
   

const getsubCategory= factory.getOne(subCategory)

   const updatesubCategory=factory.updateOne(subCategory);
   const deletesubCategory=factory.deleteOne(subCategory);
module.exports={
    createSubCategory,
    getAllsubCategories,
    getsubCategory,
    updatesubCategory,
    deletesubCategory,
    assignSubCategory,
    findObjectAssign
    

}