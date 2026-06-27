const { ObjectId } = require('mongodb');
const mongoose=require('mongoose');
const User=require('./User-Model');
const Product=require('./Product-Model')

const reviewSchema= new mongoose.Schema({
    title:String,

    rating:{
        type:Number,
        required:[true,'Rating is required'],
        min:[1,'Min rating is 1'],
        max:[5,'Max rating is 5']
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:User,
        required:[true,'Review must belong to a user']
    },

    product:{
        type:mongoose.Schema.ObjectId,
        ref:Product,
        required:[true,'Review must belong to a product']
    }
},{timestamps:true})

reviewSchema.pre(/^find/,function(){
    this.populate('user','name');
    
});

reviewSchema.statics.calcAverageRatingsAndQuantity= async function(productId){
    const result = await this.aggregate([
        {
            $match:{product:productId}
        },
        {
        $group:{
            _id:productId,
            avgRating:{$avg:'$rating'},
            ratingQuantity:{$sum:1}
        }

        }
    ])    
   if(result.length>0){
    await Product.findOneAndUpdate({_id:productId},{ratingsAverage:result[0].avgRating,ratingsQuantity:result[0].ratingQuantity})
   }
   else{
    await Product.findOneAndUpdate({_id:productId},{ratingsAverage:0,ratingsQuantity:0})
   }
} 

reviewSchema.post('save',async function(){
   await this.constructor.calcAverageRatingsAndQuantity(this.product)
})
reviewSchema.post(/^findOneAnd/, async function(doc) {
    if (doc) {
        await doc.constructor.calcAverageRatingsAndQuantity(doc.product);
    }
});

module.exports=mongoose.model('review',reviewSchema)