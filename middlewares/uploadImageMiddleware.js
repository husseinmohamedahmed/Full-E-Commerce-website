   const asynchandler=require('express-async-handler')
   const customError=require('../utils/customer-error.js');
   const multer  = require('multer');


  const multerStorage = multer.memoryStorage()
  const multerFilter=function(req,file,cb){
      if(!file.mimetype.startsWith('image')){
          cb(new customError('Only images valid',400))
      }
      else{
          cb(null,true);
      }
  } 
  

const upload = multer({storage:multerStorage,fileFilter:multerFilter});

  exports.uploadOneImage=(name)=>upload.single(name);
  exports.uploadManyImages=(fields)=>
  upload.fields(fields);