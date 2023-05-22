const express = require("express");
const { User } = require("../models")
const { authenticate } = require("../middlewares/auth/authenticate.js")
const { getRecommend, getAllhistory, getHistory, getInfoUser, editUser, editMenuUser,getRecipeHistory,getUser,listUser, editUserHistory,getInfo,}
    = require("../controllers/user.controllers");

const userRouter = express.Router();

// userRouter.get("/history/",authenticate, getAllhistory);

// userRouter.get("/history/:date",authenticate, getHistory);

// userRouter.get("/menu/:date",authenticate, getRecipeHistory)


// userRouter.get("/info/:date",authenticate, getInfo)
module.exports = {
    userRouter,
}