const express=require('express');
const app=express();
const path=require('path')
require('dotenv').config({path:'./config/.env'});
let  cors = require('cors');
let compression = require('compression')
const main=require('./config/db');
main();
const categoryRoutes=require('./routes/Category-routes');
const BrandRoutes=require('./routes/Brands-routes')
const subCategoryRoutes=require('./routes/subCategory-routes');
const productRoutes=require('./routes/Product-routes');
const userRoutes=require('./routes/User-routes');
const authRoutes=require('./routes/Auth-route');
const reviewsRoutes=require('./routes/Review-routes');
const wishlistRoutes=require('./routes/Wishlist-routes');
const addressRoutes=require('./routes/Address-routes.js');
const couponRoutes=require('./routes/Coupon-routes.js');
const cartRoutes=require('./routes/Cart-routes.js');
const orderRoutes=require('./routes/Order-routes.js');
const {webhook}=require('./services/Order-service.js')
const customError=require('./utils/customer-error');
const globalError=require('./middlewares/Error');
const mongoSanitize = require('express-mongo-sanitize');
app.set('query parser', 'extended');
app.post('/webhook-checkout', express.raw({type: 'application/json'}),webhook)
app.use(express.json({limit:'20kb'}));

app.use(cors());
app.use(compression());
app.use(express.static(path.join(__dirname,'uploads')));
app.use('/api/v1/categories',categoryRoutes);
app.use('/api/v1/subcategories',subCategoryRoutes);
app.use('/api/v1/Brands',BrandRoutes);
app.use('/api/v1/products',productRoutes);
app.use('/api/v1/users',userRoutes);
app.use('/api/v1/auth',authRoutes);
app.use('/api/v1/reviews',reviewsRoutes)
app.use('/api/v1/wishlists',wishlistRoutes);
app.use('/api/v1/addresses',addressRoutes);
app.use('/api/v1/coupons',couponRoutes);
app.use('/api/v1/carts',cartRoutes);
app.use('/api/v1/orders',orderRoutes)
app.use('/{*splat}',(req,res,next)=>{
    next(new customError(`This route is invalid ${req.originalUrl}`,404));
})

app.use(globalError)


const server= app.listen(process.env.PORTNUMBER,()=>{
    console.log("server is running on port " + process.env.PORTNUMBER);
})

process.on('unhandledRejection',(err)=>{
    console.error(`unhandled rejection errors: ${err.name} | ${err.message}`)
   server.close(()=>{
    console.error('Shutting down...');
         process.exit(1);
   })
 
})

