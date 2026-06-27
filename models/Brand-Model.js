const mongoose = require('mongoose'); 

const BrandSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Brand name is required"],
        unique:[true,"Brand name must be unique"],
        minLength:[3,"Brand name must be at least 3 characters"],
        maxLength:[32,"Brand name must be at most 32 characters"],
    },
    //A and B in URL /a-and-b
    slug:{
        lowercase:true,
        type:String
    },

    image:String
    

},{timestamps:true});


const setImageUrl=(doc)=>{
    if(doc.image){
     let url=`${process.env.URL}/uploads/categories/${doc.image}`
     doc.image=url;
    }}
    
BrandSchema.post('save',setImageUrl)
 


BrandSchema.post('init',(doc)=>{
    if(doc.image){
     let url=`${process.env.URL}/uploads/${doc.image}`
     doc.image=url;
    }
})
const BrandModel=mongoose.model('Brands',BrandSchema);
module.exports=BrandModel;