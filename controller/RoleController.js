const Role = require('../models/RoleModel');
const { Generator } = require('snowflake-generator');
const SnowflakeGenerator = new Generator(1420070400000);

module.exports = {
    create: async (req, res) => {
        try {
            const { name } = req.body;
            if(!name) return res.status(400).json({ "status": false, "error": "please provide name" });
            const data = await Role.create({
                _id: SnowflakeGenerator.generate(),
                name: name
            });
            return res.status(200).json({
                "status": true,
                "content": {
                    "data": data
                }
            });
        }
        catch (err) {
            return res.status(400).json({ "status": false, "error": err.message });
        }
    },
    getAll: async (req, res) => {
        try {
            let total = await Role.countDocuments({});
            let pages = req.query.limit || 10;
            let page = req.query.page || 1;
            let skip = (page - 1) * pages;

            const allRoles = await Role.find({}).skip(skip).limit(pages);

            return res.status(200).json({
                "status": true,
                "content": {
                    "meta": {
                        "total": total,
                        "pages": pages,
                        "page": page
                    },
                    "data": allRoles
                }
            });
        } 
        catch (err) {
            return res.status(400).json({ "status": false, "error": err.message });
        }

    }

}