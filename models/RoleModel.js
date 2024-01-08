const mongoose = require("mongoose");

const RoleSchema= new mongoose.Schema(
  {
    _id:{
        type:String,
        unique:true,
        required:true
    },
    name:{
        type:String,
        minLength:3,
        required:true
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Role", RoleSchema);
