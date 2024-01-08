const  Member= require('../models/MemberModel.js');
const { Generator } = require('snowflake-generator');
const SnowflakeGenerator = new Generator(1420070400000);

module.exports = {
    create: async (req, res) => {
        try {
            const { community , user , role } = req.body;
            if(!community || !user) return res.status(400).json({ "status": false, "error": "please provide all details" });

            const data = await Member.create({
                _id:SnowflakeGenerator.generate(),
                community,
                user,
                role
            });
            const result=await data.save();

            return res.status(200).json({
                "status": true,
                "content": {
                    "data": result
                }
            });
        }
        catch (err) {
            return res.status(400).json({ "status": false,  "error": err.message });
        }
    },
    remove: async (req, res) => {
        try {''
            const id=req.params.id;

            const deleteMember=await Member.deleteOne({_id:id});
            console.log(deleteMember);

            return res.status(200).json({ "status": true });
        } 
        catch (err) {
            return res.status(400).json({
                "status": false,
                "content": {
                    "error": err.message
                }
            });
        }

    }

}