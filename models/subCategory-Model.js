const mongoose= require('mongoose');

const subCategorySchema= new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        minlength:[2,'Subcategory is too short'],
        maxlength:[32,'Subcategory is too long'],
        required:[true,'SubCategory is required'],
        unique:[true,'Subcategory already exist']
        
    },

    slug:{
        type:String,
        lowercase:true
    },

    category:{
        type:mongoose.Schema.ObjectId,
        ref:'CategoryModel',
        required:[true,'Subcategory must belong to a parent category']
    }
},{timestamps:true}) 

module.exports= mongoose.model('subCategory',subCategorySchema);