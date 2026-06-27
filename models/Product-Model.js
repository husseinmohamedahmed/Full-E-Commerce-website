const mongoose=require('mongoose');


const productSchema= new mongoose.Schema({
    title:{
        type:String,
        trim:true,
        required:[true,'Product title is required'],
        minlength:[3,'Too short product title'],
        maxlength:[100,'Too long product title']
    },

    slug:{
        type:String,
        lowercase:true,
        required:true
    },

    description:{
        type:String,
        required:[true,'Product description is required'],
        minlength:[20,'Too short description']
    },

    quantity:{
        type:Number,
        required:[true,'Product quantity is required']
    },
    
    sold:{
        type:Number,
        default:0
    },

    price:{
        type:Number,
        required:[true,'Product price is required'],
        max:[3000000,"Too long product's price"]
    },

    priceAfterDiscount:{
        type:Number
    },

    colors:[String],

    imageCover:{
        type:String,
        required:[true,'Image cover is required']
    },

    images:[String],

    category:{
        type:mongoose.Schema.ObjectId,
        ref:'categories',
        required:[true,'Product must belong to a category']
    },

    subcategory:[{
        type:mongoose.Schema.ObjectId,
        ref:'subCategory'
    }],

    brand:{
       type:mongoose.Schema.ObjectId,
       ref:'Brands',

    },

    ratingsAverage:{
        type:Number,
        min:[1,'Rating must be equal or above 1'],
        max:[5,'Rating must be equal or below 5']
    },

    ratingsQuantity:{
        type:Number,
        default:0
    }

},{timestamps:true,
     toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
  toObject: { virtuals: true }
}) 

productSchema.post('save',(doc)=>{
     if(doc.imageCover){
     let url=`${process.env.URL}/products/${doc.imageCover}`
     doc.imageCover=url;
    }
    let images=[];
    if(doc.images.length>0){
      images=  doc.images.map((image,index)=>{
           let url=`${process.env.URL}/products/${image}`;
           image=url;
           return image
        })
    }
    doc.images=images
})
 


productSchema.post('init',(doc)=>{
     if(doc.imageCover){
     let url=`${process.env.URL}/products/${doc.imageCover}`
     doc.imageCover=url;
    }
    let images=[];
    if(doc.images && doc.images.length>0){
      images=  doc.images.map((image,index)=>{
           let url=`${process.env.URL}/products/${image}`;
           image=url;
           return image
        })
    }
    doc.images=images
})

productSchema.virtual('reviews',{ref:'review',foreignField:'product',localField:'_id'});
module.exports=mongoose.model('Product',productSchema)