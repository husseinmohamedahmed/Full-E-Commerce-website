
const mongoose = require('mongoose'); 
const bycrypt= require('bcryptjs')
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"User name is required"]
    },
    
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:[true,"Password is required"],
        minLength:[8,"Minimum characters are 8 characters"],
        maxLength:[64,"Maxmimum characters are 64 characters"]
    },

    resetCode:String,

    passwordChangedAt:Date,

    passwordExpiresIn:Date,

    passwordResetVerified:Boolean,

    phoneNumber:String,
     
    
    slug:{
        lowercase:true,
        type:String
    },

    profilePicture:String,

  
    role:{
        type:String,
        enum:['user','admin','manager'],
        default:'user'
    },
    address:[
       {id:mongoose.Schema.Types.ObjectId,
        alias:String,
        details:String,
        postalCode:String,
        phone: String,
        city: String}
    ],
    wishlist:[
        {
            type:mongoose.Schema.ObjectId,
            ref:'Product'
        }
    ]
    

},{timestamps:true});


const setImageUrl=(doc)=>{
    if(doc.profilePicture){
     let url=`${process.env.URL}/uploads/categories/${doc.profilePicture}`
     doc.profilePicture=url;
    }}
userSchema.post('save',setImageUrl);
userSchema.pre('save',async function (){
    if (!this.isModified('password')) return ;
   this.password=await bycrypt.hash(this.password,12);
  
})
const userModel=mongoose.model('User',userSchema);
module.exports=userModel;