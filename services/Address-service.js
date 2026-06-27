const asynchandler=require('express-async-handler')
const customError=require('../utils/customer-error.js');
const User = require('../models/User-Model.js')
exports.addAddress=asynchandler(async(req,res,next)=>{
    const user=await User.findOneAndUpdate({_id:req.user._id},{
        $addToSet:{address:req.body}
    },{new:true});
   res.status(200).json({status:"success",data:user.address});
});

exports.removeAddress=asynchandler(async(req,res,next)=>{
    const user=await User.findOneAndUpdate({_id:req.user._id},{
        $pull:{address:{_id:req.params.id}}
    },{new:true});
   res.status(200).json({status:"success",data:user.address});
})


exports.getLoggedUserAddresses=asynchandler(async (req,res,next)=>{
    const user= await User.findOne({_id:req.user._id});
    res.status(200).json({status:'success',data:user.address});
})