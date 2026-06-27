const Product=require('../models/Product-Model');
let slugify=require('slugify');
const asynchandler=require('express-async-handler')
const factory=require('./handlersFactory.js');
const customError=require('../utils/customer-error.js');
const ApiFeatures=require('../utils/apiFeatures.js');
const multer  = require('multer');
const sharp = require('sharp');

const {v4:uuidv4 } =require ("uuid");
const {uploadManyImages}=require('../middlewares/uploadImageMiddleware.js')
const uploadProductImages=uploadManyImages([
    {name:'imageCover',maxCount:1},
    {name:'images',maxCount:5}
]) 

const resizeProductImages=asynchandler(async (req,res,next)=>{
    if(req.files.imageCover){
    const imageCoverName=`product-${uuidv4()}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer).resize({width:2000,height:1333,fit:'fill'}).toFormat('jpeg').jpeg({quality:95}).toFile(`uploads/products/${imageCoverName}`)
    req.body.imageCover=imageCoverName;}
    if(req.files.images){
    req.body.images=[];
    await Promise.all(req.files.images.map(async (image,index)=>{
        const imageName=`product-${uuidv4()}-${Date.now()}-${index}.jpeg`;
        await sharp(image.buffer).resize({width:2000,height:1333,fit:'fill'}).toFormat('jpeg').jpeg({quality:95}).toFile(`uploads/products/${imageName}`);
        req.body.images.push(imageName)
    }))}
      next();
    }
   
)

const createProduct= factory.create(Product)

const getAllProducts=factory.getAll(Product,'products');

const getProduct= factory.getOne(Product,'reviews')

const updateProduct=factory.updateOne(Product)

const deleteProduct=factory.deleteOne(Product)

module.exports={createProduct,getAllProducts,getProduct,updateProduct,deleteProduct,uploadProductImages,resizeProductImages}