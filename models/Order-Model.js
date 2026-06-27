const mongoose = require('mongoose');

const orderSchema= new mongoose.Schema({
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:[true,'Order shoud have a user']
    },

      cartItems:[{
          product:  {
                type:mongoose.Schema.ObjectId,
                ref:'Product'
            },
         quantity:{type:Number,default:1},
         color:String,
         price:Number  
    }],

    taxPrice:{type:Number,
        default:0
    },
    shippingPrice:{type:Number,
        default:0
    },
    shippingAddress:{
      details: String,
      phone: String,
      city: String,
      postalCode: String
    },
    totalOrderPrice: {
      type: Number
    },
    paymentMethod:{
        type:String,
        enum:['cash','card'],
        default:'cash'
    },
    isPaid:{
        type:Boolean,
        default:false
    },

    paidAt:Date,

    isDelivered:{
        type:Boolean,
        default:false
    },
    deliveredAt:Date
},{timestamps:true})

orderSchema.pre(/^find/,function(){
    this.populate({path:'user',select:'name profilePicture email phone'}).populate({path:'cartItems.product',select:'title imageCover'})
})
module.exports=mongoose.model('Order',orderSchema);