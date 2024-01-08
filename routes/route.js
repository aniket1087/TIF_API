const express=require('express');
const router=new express.Router;
const { isAdmin, isAdminandModerator } = require('../middleware/Auth');

//role entry point
const Role=require('../controller/RoleController');

router.post("/v1/role",Role.create);
router.get("/v1/role",Role.getAll);

//user entry point
const User=require('../controller/UserController');

router.post("/v1/auth/signup",User.create);
router.post("/v1/auth/signin",User.getUser);
router.get("/v1/auth/me",User.getMe);

//communtiy entry point
const Community=require('../controller/CommunityController');

router.post("/v1/community",Community.create);
router.get("/v1/community",Community.getAll);
router.get("/v1/community/:id/members",Community.getAllMember);
router.get("/v1/community/me/owner",Community.getMyOwnedCommuntiy);
router.get("/v1/community/me/member",Community.getMyJoinedCommunity);

const Member=require('../controller/MemberController');

router.post("/v1/member",isAdmin,Member.create);
router.delete("/v1/member/:id",isAdminandModerator,Member.remove);

module.exports=router;