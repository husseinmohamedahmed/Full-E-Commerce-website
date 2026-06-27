const mongoose = require('mongoose'); 

const CategorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"category name is required"],
        unique:[true,"category name must be unique"],
        minLength:[3,"category name must be at least 3 characters"],
        maxLength:[32,"category name must be at most 32 characters"],
    },
    //A and B in URL /a-and-b
    slug:{
        lowercase:true,
        type:String
    },

    image:String
    

},{timestamps:true});


CategorySchema.post('save',(doc)=>{
    if(doc.image){
     let url=`${process.env.URL}/categories/${doc.image}`
     doc.image=url;
    }
}) 


CategorySchema.post('init',(doc)=>{
    if(doc.image){
     let url=`${process.env.URL}/uploads/${doc.image}`
     doc.image=url;
    }
})
const CategoryModel=mongoose.model('categories',CategorySchema);

module.exports=CategoryModel;