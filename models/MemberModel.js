var mongoose = require('mongoose');

const MemberSchema= new mongoose.Schema(
  {
    _id:{
        type:String,
        unique:true,
        required:true
    },
    community:{
        type:mongoose.Schema.Types.String,
        ref:"Community",
        required:true
    },
    user: { 
        type:mongoose.Schema.Types.String,
        ref:"User",
        required:true
    },
    role:{
        type:mongoose.Schema.Types.String,
        ref:"Role",
        required:true
    },

  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);
module.exports = mongoose.model("Member", MemberSchema);