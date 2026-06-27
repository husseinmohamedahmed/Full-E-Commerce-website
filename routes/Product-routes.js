const express=require('express');
const router=express.Router();
const Product=require('../models/Product-Model');
const {check,validationResult}=require('express-validator')
const {createProduct,getAllProducts,getProduct,updateProduct,deleteProduct,uploadProductImages,resizeProductImages}=require('../services/Product-service');
const {getProductValidator,createProductValidator,deleteProductValidator,updateProductValidator}=require('../utils/validators/ProductValidator')
const {allowedTo,protect}=require('../services/Auth-service');
const reviewRoutes= require('./Review-routes');
router.use('/:id/reviews',reviewRoutes)

router.route('/')
    .post(protect,allowedTo('admin','manager'),uploadProductImages,resizeProductImages,createProductValidator,createProduct)
    .get(getAllProducts)

router.route('/:id')
    .get(getProductValidator,getProduct)
    .put(protect,allowedTo('admin','manager'),uploadProductImages,resizeProductImages,updateProductValidator,updateProduct)
    .delete(protect,allowedTo('admin'),deleteProductValidator,deleteProduct)


     

module.exports=router;