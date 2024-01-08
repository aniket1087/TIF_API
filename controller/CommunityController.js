const Community = require('../models/CommunityModel');
const slugify = require('slugify')
const UserModel = require('../models/UserModel');
const MemberModel = require('../models/MemberModel');
const RoleModel = require('../models/RoleModel');
const { validateActivationToken } = require('../utils/token');

const { Generator } = require('snowflake-generator');
const SnowflakeGenerator = new Generator(1420070400000);

module.exports = {
    create: async (req, res) => {
        const { name } = req.body;
        if (!name) return res.status(400).json({ "status": false, "error": "please provide name of community" });

        try {
            const cookieToken = req.cookies.authorization;
            const token = cookieToken ? cookieToken : req.headers['authorization'];

            if (!token) return res.status(400).json({ "status": false, "error": "doesnot find valid user token" });

            const { email } = validateActivationToken(token);

            const user = await UserModel.findOne({ email });

            const alreadyCreate = await Community.findOne({ owner: user._id, name });

            if (!alreadyCreate) {
                const data = await Community.create({
                    _id: SnowflakeGenerator.generate(),
                    name: name,
                    slug: slugify(name),
                    owner: user._id
                });
                const result = await data.save();

                const role = await RoleModel.create({
                    _id: SnowflakeGenerator.generate(),
                    name: "Community Admin"
                });

                const member = await MemberModel.create({
                    _id: SnowflakeGenerator.generate(),
                    community: result._id,
                    user: user._id,
                    role: role._id,
                })
                await member.save();

                return res.status(200).json({
                    "status": true,
                    "content": {
                        "data": result
                    }
                });
            }
            else return res.status(400).json({ "status": false, "error": "doesnot find valid user token" });
        }
        catch (err) {
            console.log(err);
            return res.status(400).json({
                "status": false,
                "content": {
                    "error": err.message
                }
            });
        }
    },
    getAll: async (req, res) => {
        try {
            let total = await Community.countDocuments({});
            let pages = req.query.limit || 10;
            let page = req.query.page || 1;
            let skip = (page - 1) * pages;

            const allCommunities = await Community.find({}).skip(skip).limit(pages).populate({
                path: 'owner',
                select: "name"
            });

            return res.status(200).json({
                "status": true,
                "content": {
                    "meta": {
                        "total": total,
                        "pages": pages,
                        "page": page
                    },
                    "data": allCommunities
                }
            });
        }
        catch (err) {
            return res.status(400).json({ "status": false, "error": err.message });
        }

    },
    getAllMember: async (req, res) => {
        try {
            const id = req.params.id;

            let total = await MemberModel.countDocuments({ community: id });
            let pages = req.query.limit || 10;
            let page = req.query.page || 1;
            let skip = (page - 1) * pages;

            const data = await MemberModel.find({ community: id }).populate({
                path: "user role",
                select: "name"
            }).skip(skip).limit(page);

            return res.status(200).json({
                "status": true,
                "content": {
                    "meta": {
                        "total": total,
                        "pages": pages,
                        "page": page
                    },
                    "data": data
                }
            });
        } catch (err) {
            return res.status(400).json({ "status": false,"error": err.message });
        }
    },
    getMyOwnedCommuntiy: async (req, res) => {
        try {
            const cookieToken = req.cookies.authorization;
            const token = cookieToken ? cookieToken : req.headers['authorization'];
            if (!token) return res.status(400).json({ "status": false, "error": "doesnot find valid user token" });

            const { email } = validateActivationToken(token);

            const user = await UserModel.findOne({ email });

            let total = await Community.countDocuments({ owner: user._id });
            let pages = req.query.limit || 10;
            let page = req.query.page || 1;
            let skip = (page - 1) * pages;

            const ownCommunities = await Community.find({ owner: user._id }).skip(skip).limit(pages);

            return res.status(200).json({
                "status": true,
                "content": {
                    "meta": {
                        "total": total,
                        "pages": pages,
                        "page": page
                    },
                    "data": ownCommunities
                }
            });
        } catch (err) {
            return res.status(400).json({ "status": false, "error": err.message });
        }
    },
    getMyJoinedCommunity: async (req, res) => {
        try {
            const cookieToken = req.cookies.authorization;
            const token = cookieToken ? cookieToken : req.headers['authorization'];
            if (!token) return res.status(400).json({ "status": false, "error": "doesnot find valid user token" });

            const { email } = validateActivationToken(token);

            const user = await UserModel.findOne({ email });

            const data = await MemberModel.find({ user: user._id}).populate({
                path: 'role',
                match: { name: { $ne: "Community Admin" } }
            }).populate({
                path: "community",
                populate: {
                    path: "owner",
                    select: "name"
                }
            });

            const filtered = data.filter((item) => {
                if (item.role) return true;
                else return false;
            })
            const result = filtered.map((item) => {
                return item.community;
            });

            let total = result.length;
            let pages = req.query.limit || 10;
            let page = req.query.page || 1;
            let skip = (page - 1) * pages;
            
            res.status(200).json({
                "status": true,
                "content": {
                    "meta": {
                        "total": total,
                        "pages": pages,
                        "page": page
                    },
                    "data": result.slice(skip,skip+page)
                }
            });

        } catch (err) {
            return res.status(400).json({"status": false,"error": err.message });
        }
    }
}