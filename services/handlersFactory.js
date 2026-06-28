
const asynchandler=require('express-async-handler')
const customError=require('../utils/customer-error')
const ApiFeatures=require('../utils/apiFeatures.js')
const User=require('../models/User-Model.js')
const Review=require('../models/Review-Model.js')
exports.create=(Model)=>
   asynchandler(async (req, res, next) => {
    if(Model===Review){
      req.body.user=req.user._id;
    }
    const document= await Model.create(req.body);
    res.status(201).json(document);
  });

exports.getOne= (Model,populateOptions)=>
  asynchandler(async (req, res, next) => {
    const { id } = req.params;
    let query =Model.findById(id);
    if(populateOptions){
      query=query.populate(populateOptions)
    }
    const document=await query
    if (!document) {
      return next(new customError("The document is not found", 404));
    }
    res.status(200).json({ status: "success", data: document });
  });
  
exports.getAll=(Model,name)=>
  asynchandler(async (req, res, next) => {
     const noOfPages=await  Model.countDocuments();
       let findCondition={};
       if(req.findObject){
          findCondition=req.findObject
       }
       const apiFeatures= new ApiFeatures(Model.find(findCondition),req.query).
       filter().
       sort().
       limitFields().
       search(name).
       paginate(noOfPages);
    
       const document=await apiFeatures.mongooseQuery;
    res.status(200).json({ status: "success",result:apiFeatures.paginationResults, data: document });
  });

exports.updateOne=(Model)=>
  asynchandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findOne(
      { _id: id },
     
    );
    if (!document) {
      return next(new customError("The document is not found", 404));
    }
    if(req.body.title){
      document.title=req.body.title
    }
    if(req.body.rating){
      document.rating=req.body.rating
    }
    await document.save();
    res.status(200).json({ status: "success", data: document });
  })


exports.deleteOne=(Model)=>{return asynchandler(async (req, res, next) => {
  const { id } = req.params;
  const document= await Model.findById(id);
  if (!document) {
    return next(new customError(` No Document found for this id ${id}`, 404));
  }
  await document.deleteOne();
  res.status(204).json({ status: "success", data: document});
})}