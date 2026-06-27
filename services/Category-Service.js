const categoryModel=require('../models/Category-Model');
let slugify=require('slugify');
const asynchandler=require('express-async-handler')
const ApiFeatures=require('../utils/apiFeatures.js')
const customError=require('../utils/customer-error.js');
const factory=require('./handlersFactory.js');
const multer  = require('multer');
const sharp = require('sharp');
const {v4:uuidv4 } =require ("uuid");
const {uploadOneImage}=require('../middlewares/uploadImageMiddleware.js')
// const multerStorage= multer.diskStorage({
//     destination:function(req,file,cb){
//         cb(null,'uploads/categories');
//     },
//     filename:function(req,file,cb){
//        const extension=file.mimetype.split('/')[1];
//        const filename=`category-${uuidv4()}-${Date.now()}.${extension}`;
//        cb(null,filename);
//     }
// })

const resize=asynchandler(async(req,res,next)=>{
    if(req.files){
    const filename=`category-${uuidv4()}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer).resize({width:600,height:600,fit:'fill'}).toFormat('jpeg').jpeg({quality:95}).toFile(`uploads/categories/${filename}`)
    req.body.image=filename;}
    next()
})

const uploadCategoryImage=uploadOneImage('image')

const createCategory= factory.create(categoryModel);

const getAllCategories=factory.getAll(categoryModel)

const getCategory= factory.getOne(categoryModel)

const updateCategory=factory.updateOne(categoryModel)

const deleteCategory=factory.deleteOne(categoryModel)

module.exports={createCategory,getAllCategories,getCategory,updateCategory,deleteCategory,uploadCategoryImage,resize}