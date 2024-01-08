const User = require('../models/UserModel');
const { createActivationToken, validateActivationToken } = require("../utils/token");
const { Generator } = require('snowflake-generator');
const SnowflakeGenerator = new Generator(1420070400000);
const bcrypt = require('bcrypt');
const saltRounds = 10;


module.exports = {
    create: async (req, res) => {
        try {
            const { name, email, password } = req.body;
            if(!name || !email || !password) res.status(400).json({"status": false, "error": "please fill all details" });

            const hashPassword = await bcrypt.hash(password, saltRounds);

            const token = createActivationToken({ email, hashPassword });

            const data = await User.create({
                _id: SnowflakeGenerator.generate(),
                name,
                email,
                password: hashPassword
            });
            data.password = undefined;

            res.cookie("authorization", token);
            
            return res.status(200).json({
                "status": true,
                "content": {
                    "data": data,
                    "meta": {
                        "access_token": token
                    }
                }
            });
        }
        catch (err) {
            return res.status(400).json({"status": false, "error": err.message });
        }
    },
    getUser: async (req, res) => {
        try {
            const { email, password } = req.body;
            if(!email || !password ) res.status(400).json({"status": false, "error": "please fill all details" });

            const user = await User.findOne({ email });

            if (!user) return res.status(400).json({"status": false, "error": "User does not exist, please create your account" });
            else {
                const match = await bcrypt.compare(password, user.password);

                const token = createActivationToken({ email, hashPassword: user.password });

                user.password = undefined;
                if (match) {
                    res.cookie("authorization", token);
                    return res.status(200).json({
                    "status": true,
                    "content": {
                        "data": user,
                        "meta": {
                            "access_token": token
                        }
                    }
                })}
                else return res.status(400).json({"status": false, "error": "Password doesn't match" });
            }
        } catch (err) {
            return res.status(400).json({ "status": false, "error": err.message })
        }
    },
    getMe: async (req, res) => {
        try {
            const cookieToken=req.cookies.authorization;
            const token = cookieToken? cookieToken: req.headers['authorization'];

            if(!token) return res.status(400).json({"status": false,"error":"doesnot find valid user token" });

            const { email  } = validateActivationToken(token);
            const user = await User.findOne({ email });
            user.password = undefined;

            return res.status(200).json({
                "status": true,
                "content": {
                    "data": user
                }
            })
        } catch (err) {
            return res.status(400).json({"status": false,"error": err.message });
        }
    }
}