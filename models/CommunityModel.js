var mongoose = require('mongoose');

const CommunitySchema= new mongoose.Schema(
  {
    _id:{
        type:String,
        unique:true,
        required:true
    },
    name:{
        type:String,
        maxLength:128,
        required:true,
        unique:true
    },
    slug: { 
        type: String, 
        maxLength:255,
        required:true,
    },
    owner:{
        type:mongoose.Schema.Types.String,
        ref:"User",
        required:true
    },

  },
  {
    timestamps :true
  }
);
module.exports = mongoose.model("Community", CommunitySchema);