const mongoose = require("mongoose");

const UserSchema= new mongoose.Schema(
  {
    _id:{
        type:String,
        unique:true,
        required:true
    },
    name:{
        type:String,
        maxLength:64,
        minLength:2,
        required:true,
        default : null
    },
    email:{
        type:String,
        maxLength:128,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minLength:6,
        maxLength:64,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

module.exports = mongoose.model("User", UserSchema);
