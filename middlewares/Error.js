
const globalError=(err,req,res,next)=>{
    console.log(process.env.NODE_ENV)
         if(process.env.NODE_ENV==='development'){
            sendErrorForDev(err,res);
         } 
         else{
            sendErrorForProd(err,res);
         }
    }

const sendErrorForDev=(err,res)=>{
err.statusCode=err.statusCode || 500;
    err.status=err.status || 'error'
    res.status(err.statusCode).json({status:err.status,data:err.message,stack:err.stack})
}

const sendErrorForProd=(err,res)=>{
err.statusCode=err.statusCode || 500;
    err.status=err.status || 'error'
    res.status(err.statusCode).json({status:err.status,data:err.message})
}
module.exports=globalError;