const Cart = require("../models/Cart-Model");
let slugify = require("slugify");
const asynchandler = require("express-async-handler");
const factory = require("./handlersFactory.js");
const customError = require("../utils/customer-error.js");
const Product=require('../models/Product-Model.js')
const Coupon=require('../models/Coupon-Model.js')
const calcTotalPrice=(cart)=>{
    let totalPrice=0;
    cart.cartItems.forEach((item)=>{
         totalPrice+= item.price*item.quantity;
    })
    return totalPrice;
}

exports.addToCart=asynchandler(async (req,res,next)=>{
    let cart=await Cart.findOne({user:req.user._id});
    const{productId,color}=req.body;
    const product=await Product.findById(productId);
    if (!product) {
    return next(new customError("Product not found", 404));
}
    if(product.quantity===0){
        return next(new customError("Product is not available right now"))
    }
    if(!cart){
        cart=await Cart.create({
            user:req.user._id,
            cartItems:[{product:productId,price:product.price,color}]
        })
    }else{
        const cartItemIndex= cart.cartItems.findIndex((item)=>{
            return item.product.toString()==productId && item.color==color
        });

        if(cartItemIndex>-1){
            if(cart.cartItems[cartItemIndex].quantity===product.quantity){
                return next(new customError("Not enough product quantity in the store"))
            }
            cart.cartItems[cartItemIndex].quantity++;
        }
        else{
            cart.cartItems.push({product:productId,color,price:product.price})
        }

    }

    //calc total pric
    cart.totalCartPrice=calcTotalPrice(cart);
    await cart.save();
    res.status(200).json({status:'success',cart})
})



exports.getLoggedUserCart=asynchandler(async (req,res,next)=>{
    const cart= await Cart.findOne({user:req.user._id});
    if(!cart){
        return next(new customError("Not cart for this user",404))
    }
    res.status(200).json({status:"success",noOfItems:cart.cartItems.length,cart})
})


exports.removeItem= asynchandler(async(req,res,next)=>{
    const cart= await Cart.findOneAndUpdate({user:req.user._id},{
        $pull:{cartItems:{_id:req.params.id}}
    },{new:true});
    if(!cart){
        return next(new customError("There is no cart for this user",404))
    }
    
    //recalculate the total price after removal
      cart.totalCartPrice=calcTotalPrice(cart);
      res.status(200).json({success:'success',noOfItems:cart.cartItems.length,cart})
})


exports.clearCart= asynchandler(async(req,res,next)=>{
   const cart= await Cart.findOne({user:req.user._id})
    if(!cart){
        return next(new customError("Not cart for this user",404))
    }
    cart.deleteOne();
    res.status(204).json();
});


exports.updateCartItemQuantity= asynchandler(async (req,res,next)=>{
    const cart= await Cart.findOne({user:req.user._id});
     if(!cart){
        return next(new customError("There is no cart for this user",404))
    }
    
    const index=cart.cartItems.findIndex((item)=>{
       return item._id.toString()===req.params.id;
    })
    if(index>-1){
        cart.cartItems[index].quantity=+req.body.quantity;
    }
    else{
        return next(new customError("Cart item is not found",404)) ;
    }
    cart.totalCartPrice=calcTotalPrice(cart);
    await cart.save();
    res.status(200).json({success:'success',noOfItems:cart.cartItems.length,cart})
})

exports.applyCoupon= asynchandler(async (req,res,next)=>{
    const cart=await Cart.findOne({user:req.user._id});
    if(!cart){
        return next(new customError("There is no cart for this user",404))
    };
    const coupon =await Coupon.findOne({name:req.body.name,expireTime:{$gt: Date.now()}})
    if(!coupon){
        return next(new customError('Invalid coupon',400))
    }
    let totalCartPrice= cart.totalCartPrice;
    cart.totalPriceAfterDiscount= (totalCartPrice-(totalCartPrice*coupon.discount/100)).toFixed(2);
    await cart.save();
    res.status(200).json({success:'success',noOfItems:cart.cartItems.length,cart})

})