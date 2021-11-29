const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types
const userSchema = new mongoose.Schema({

name:{
    type:String,
    required:true
},
email:{
    type:String,
    required:true
},
password:{
    type:String,
    required:true
},
pic:{
    type:String,
    default:"https://res.cloudinary.com/subham24488/image/upload/v1594286441/avatar_k8okhj.png"
},
followers:[{type:ObjectId, ref:"User"}],

following:[{type:ObjectId, ref:"User"}]
});

mongoose.model("User", userSchema);