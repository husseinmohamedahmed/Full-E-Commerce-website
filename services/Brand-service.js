const Brand = require("../models/Brand-Model");
let slugify = require("slugify");
const asynchandler = require("express-async-handler");
const factory = require("./handlersFactory.js");
const customError = require("../utils/customer-error.js");
const ApiFeatures = require("../utils/apiFeatures.js");
const { uploadOneImage } = require("../middlewares/uploadImageMiddleware.js");
const {v4:uuidv4 } =require ("uuid");
const sharp = require('sharp');
const uploadBrand = uploadOneImage("image");

const resizeBrand=asynchandler(async(req,res,next)=>{
    if(req.files){
    const filename=`brand-${uuidv4()}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer).resize({width:600,height:600,fit:'fill'}).toFormat('jpeg').jpeg({quality:95}).toFile(`uploads/brands/${filename}`)
    req.body.image=filename;}
    next()
})

const createBrand = factory.create(Brand);

const getAllBrands = factory.getAll(Brand);

const getBrand = factory.getOne(Brand);

const updateBrand = factory.updateOne(Brand);

const deleteBrand = factory.deleteOne(Brand);

module.exports = {
  createBrand,
  getAllBrands,
  getBrand,
  updateBrand,
  deleteBrand,
  uploadBrand,
  resizeBrand
};
