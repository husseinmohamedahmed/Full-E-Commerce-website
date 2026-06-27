const mongoose = require('mongoose');

const main= async()=>{
    await mongoose.connect(process.env.DB_CONNECTION_STRING);
    console.log("connected to database");
}
module.exports=main;