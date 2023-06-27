const express = require("express");

const { getReportByDateAdmin, getListManager, getDetailChangeIngredientShop, addStaff, getSixMonthInputAndOuput, editStaff, deleteStaff }
    = require("../controllers/admin.controllers");
    const { checkNotExistAcount, checkExistAccount } = require("../middlewares/validates/checkExist");
const { authorize } = require("../middlewares/auth/authorize.js")
const { authenticate } = require("../middlewares/auth/authenticate.js")
const adminRouter = express.Router();

adminRouter.get("/reportByDate/:date", authenticate, authorize(3), getReportByDateAdmin);
adminRouter.post("/addStaff", authenticate, authorize(3), checkNotExistAcount(), addStaff)
adminRouter.put("/editStaff", authenticate, authorize(3), checkExistAccount(), editStaff)
adminRouter.delete("/deleteStaff", authenticate, authorize(3), checkExistAccount(), deleteStaff)
adminRouter.get("/detailChangeIngredientShop/:date", authenticate, authorize(3), getDetailChangeIngredientShop);
adminRouter.get("/getDataForChart", authenticate, authorize(3), getSixMonthInputAndOuput)
adminRouter.get("/getListManager", authenticate, authorize(3), getListManager)

module.exports = {
    adminRouter,
}