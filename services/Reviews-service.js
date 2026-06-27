const Review = require("../models/Review-Model");
let slugify = require("slugify");
const asynchandler = require("express-async-handler");
const factory = require("./handlersFactory.js");
const customError = require("../utils/customer-error.js");


const findObjectAssign=asynchandler(async (req,res,next)=>{
  
  if(req.params.id){
    const filterObject={product:req.params.id};
     req.filterObject=filterObject;
  }
  return next();
});

const assignProductId=asynchandler(async (req,res,next)=>{
  if(req.params.id){
    req.body.product=req.params.id;
  }
  next();
})

const createReview = factory.create(Review);

const getAllReviews = factory.getAll(Review);

const getReview = factory.getOne(Review);

const updateReview = factory.updateOne(Review);

const deleteReview = factory.deleteOne(Review);

module.exports = {
  createReview,
  getAllReviews,
  getReview,
  updateReview,
  deleteReview,
  findObjectAssign,
  assignProductId
};
