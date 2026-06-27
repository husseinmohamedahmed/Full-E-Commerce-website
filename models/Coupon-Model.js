const mongoose=require('mongoose');


const couponSchema= new mongoose.Schema({
name:{
    type:String,
    trim:true,
    required:[true,'Coupon name is required'],
    unique:true
},

expireTime:{
    type:Date,
    required:[true,'Expiration time is required']
},
discount:{
    type:Number,
    required:[true,'Discount value is required']
}
},{timestamps:true})

module.exports=mongoose.model('Coupon',couponSchema);
