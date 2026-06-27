const fs=require('fs');
const dbConnection=require('../../config/db');
const dotenv=require('dotenv');
dotenv.config({path:'../../config/.env'})
dbConnection();
const Product=require('../../models/Product-Model');
let products=JSON.parse(fs.readFileSync('./products.json'));


const insertData= async ()=>{
    try{
        await Product.insertMany(products);
        console.log("Data is inserted successfully");
        process.exit(0);
    }
    catch(err){
        console.log("Error in inserting the data");
        process.exit(1);
    }
}

const deleteData=async ()=>{
    try{
        await Product.deleteMany();
        console.log("Data is destroyed successfully");
        process.exit(0);
    }
    catch(err){
        console.log("Error in destroying data");
        process.exit(1);
    }
}

if(process.argv[2]=='-i'){
    insertData();
}
if(process.argv[2]=='-d'){
    deleteData();
}

