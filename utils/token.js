const jwt = require("jsonwebtoken");
require('dotenv').config();


const createActivationToken = (User) => {
    const token=jwt.sign(User, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRES,
    });
    return `Bearer ${token}`;
};


const validateActivationToken=(token)=>{
    const validToken=token.slice(7);
    return jwt.verify(validToken,process.env.JWT_SECRET_KEY);
}

module.exports={
    createActivationToken,
    validateActivationToken
}