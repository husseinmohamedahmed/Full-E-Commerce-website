const express=require('express');
const router=express.Router();
const Brand=require('../models/Brand-Model');
const {uploadOneImage}=require('../middlewares/uploadImageMiddleware')
const {check,validationResult}=require('express-validator')
const {createBrand,getAllBrands,getBrand,updateBrand,deleteBrand,resizeBrand,uploadBrand}=require('../services/Brand-Service');
const {getBrandValidator,createBrandValidator,deleteBrandValidator,updateBrandValidator}=require('../utils/validators/BrandValidator')
const {allowedTo,protect}=require('../services/Auth-service')
router.route('/')
    .post(protect,allowedTo('admin','manager'),uploadBrand,resizeBrand,createBrandValidator,createBrand)
    .get(getAllBrands)

router.route('/:id')
    .get(getBrandValidator,getBrand)
    .put(protect,allowedTo('admin','manager'),uploadBrand,resizeBrand,updateBrandValidator,updateBrand)
    .delete(protect,allowedTo('admin'),deleteBrandValidator,deleteBrand)

     

module.exports=router;