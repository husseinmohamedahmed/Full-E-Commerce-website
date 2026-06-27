const asynchandler=require('express-async-handler')
const customError=require('../utils/customer-error.js');
const User = require('../models/User-Model.js')
exports.addToWishlist=asynchandler(async(req,res,next)=>{
    const user=await User.findOneAndUpdate({_id:req.user._id},{
        $addToSet:{wishlist:req.body.product}
    },{new:true});
   res.status(200).json({status:"success",data:user.wishlist});
});

exports.removeFromWishlist=asynchandler(async(req,res,next)=>{
    const user=await User.findOneAndUpdate({_id:req.user._id},{
        $pull:{wishlist:req.params.id}
    },{new:true});
   res.status(200).json({status:"success",data:user.wishlist});
})


exports.getLoggedUserWishlist=asynchandler(async (req,res,next)=>{
    const user= await User.findOne({_id:req.user._id}).populate('wishlist');
    res.status(200).json({status:'success',data:user.wishlist});
})