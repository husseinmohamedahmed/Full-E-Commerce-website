const express=require('express');
const router= express.Router({mergeParams:true});

const{
    createSubCategory,
    getAllsubCategories,
    getsubCategory,
    updatesubCategory,
    deletesubCategory,
    assignSubCategory,findObjectAssign

}=require('../services/subCategory-service')
const{createSubCategoryValidator,
    getSubCategoryValidator,
    updateSubCategoryValidator,
    deleteSubCategoryValidator
}=require('../utils/validators/subCategoryValidator')
const {allowedTo,protect}=require('../services/Auth-service')
router.route('/')
       .post(protect,allowedTo('admin','manager'),assignSubCategory,createSubCategoryValidator, createSubCategory)
       .get(findObjectAssign,getAllsubCategories);

router.route('/:id')
       .get(getSubCategoryValidator,getsubCategory)
       .put(protect,allowedTo('admin','manager'),updateSubCategoryValidator,updatesubCategory)
       .delete(protect,allowedTo('admin'),deleteSubCategoryValidator,deletesubCategory)

module.exports=router