const express=require('express');
const router=express.Router();
const CategoryModel=require('../models/Category-Model');
const {check,validationResult}=require('express-validator')
const {createCategory,getAllCategories,getCategory,updateCategory,deleteCategory,uploadCategoryImage,resize}=require('../services/Category-Service');
const {getCategoryValidator,createCategoryValidator,deleteCategoryValidator,updateCategoryValidator}=require('../utils/validators/categoryValidator')
const subCategoryRouter= require('./subCategory-routes');
const {allowedTo,protect}=require('../services/Auth-service')
router.route('/')
    .post(protect,allowedTo('admin','manager'),uploadCategoryImage,resize,createCategoryValidator,createCategory)
    .get(getAllCategories)

router.route('/:id')
    .get(getCategoryValidator,getCategory)
    .put(protect,allowedTo('admin','manager'),uploadCategoryImage,resize,updateCategoryValidator,updateCategory)
    .delete(protect,allowedTo('admin'),deleteCategoryValidator,deleteCategory)

router.use('/:id/subcategories',subCategoryRouter);
     

module.exports=router;