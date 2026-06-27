const asynchandler = require("express-async-handler");
const customError = require("../utils/customer-error.js");
const Cart = require("../models/Cart-Model");
const Order=require('../models/Order-Model.js')
const Product=require('../models/Product-Model.js')
const factory=require('./handlersFactory.js');
const stripe = require('stripe')(process.env.STRIPE_SECRET);


exports.createCashOrder= asynchandler(async(req,res,next)=>{
    let taxes=0,shippingPrice=0;
       const cart= await Cart.findOne({user:req.user._id});
    if(!cart){
        return next(new customError("No cart for this user",404))
    }

    let totalOrderPrice= cart.totalPriceAfterDiscount?cart.totalPriceAfterDiscount:cart.totalCartPrice;
    totalOrderPrice=totalOrderPrice+taxes+shippingPrice;

    const order= await Order.create({cartItems:cart.cartItems,
        user:req.user._id,
        shippingAddress:req.body.shippingAddress,
        totalOrderPrice
    })
  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkOption, {});

    // 5) Clear cart depend on cartId
    await Cart.findByIdAndDelete(req.params.cartId);
  }
    res.status(201).json({status:"success",data:order})
}) 

exports.filterObject= asynchandler(async (req,res,next)=>{
    if(req.user.role==='user'){
        req.findObject={user:req.user._id};
    } 
    next();
})
 
exports.getAllOrders=factory.getAll(Order);


exports.getSpecificOrder=factory.getOne(Order)


exports.updateOrderToPaid= asynchandler(async (req,res,next)=>{
    const order= await Order.findById(req.params.id);
    if(!order){
        return next(new customError("Order not found",404))
    }
    order.isPaid=true;
    order.paidAt= Date.now();
    order.save();
    res.status(200).json({status:'success',order});
}) 

exports.updateOrderToDelivered= asynchandler(async (req,res,next)=>{
    const order= await Order.findById(req.params.id);
    if(!order){
        return next(new customError("Order not found",404))
    }
    order.isDelivered=true;
    order.deliveredAt= Date.now();
    order.save();
    res.status(200).json({status:'success',order});
}) 


exports.checkOutSession= asynchandler(async (req,res,next)=>{
     let taxes=0,shippingPrice=0;
       const cart= await Cart.findOne({_id:req.params.cartID});
    if(!cart){
        return next(new customError("No cart for this user",404))
    }

    let totalOrderPrice= cart.totalPriceAfterDiscount?cart.totalPriceAfterDiscount:cart.totalCartPrice;
    totalOrderPrice=totalOrderPrice+taxes+shippingPrice;

    const session = await stripe.checkout.sessions.create({
        line_items: [
  {
    price_data: {
      currency: "egp",
      product_data: {
        name: "Order"
      },
      unit_amount: totalOrderPrice * 100
    },
    quantity: 1
  }
],
        mode:'payment',
        success_url:`${req.protocol}://${req.get('host')}/api/v1/orders`,
        cancel_url:`${req.protocol}://${req.get('host')}/api/v1/carts`,
        client_reference_id:req.params.cartID,
        customer_email:req.user.email,
        metadata:req.body.shippingAddress

    })
      res.status(200).json({ status: 'success', session });
}) 


exports.webhook=asynchandler(async (req,res,next)=>{
  let event= req.body;
  const signature = req.headers['stripe-signature'];
  if(process.env.SIG_SECRET){
     try {
      event = stripe.webhooks.constructEvent(
        request.body,
        signature,
        process.env.SIG_SECRET
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return res.status(400).json(" Webhook signature verification failed")
    }
  }
   if(event.type='payment_intent.succeeded'){
    console.log(event.object);
  }
  }

 
)