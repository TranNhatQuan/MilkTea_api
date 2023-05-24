const express = require("express");

const { authenticate } = require("../middlewares/auth/authenticate.js")
const { getRecommend, getAllhistory, getHistory, getInfoUser, editUser, editMenuUser,getRecipeHistory,getUser,listUser, editUserHistory,getInfo,}
    = require("../controllers/staff.controllers");

const staffRouter = express.Router();
//lay ra 1 danh sach random cac mon cho user gom 3 bua sang trua toi day du
// staffRouter.get("/history/",authenticate, getAllhistory);

// staffRouter.get("/history/:date",authenticate, getHistory);

// staffRouter.get("/menu/:date",authenticate, getRecipeHistory)

// staffRouter.put("/menu/edit/:date",authenticate, editMenuUser)

// staffRouter.get("/detail",authenticate, getInfoUser)

// staffRouter.put("/edit/detail",authenticate, editUser)

// staffRouter.get("/detail/:id",authenticate, getUser)

// staffRouter.get("/hwnet/list",authenticate, listUser)

// staffRouter.put("/edit/history/:date",authenticate, editUserHistory)

// staffRouter.get("/info/:date",authenticate, getInfo)
module.exports = {
    staffRouter,
}