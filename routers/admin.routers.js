const express = require("express");

const { getReportByDateAdmin, getListManager, getDetailChangeIngredientShop, getSixMonthInputAndOuput,
        getListShop, editShop, addShop, addManager, editManager, deleteManager, getSixMonthInputAndOuputAllShop,
        getListIngredient, 
        addIngredient}
    = require("../controllers/admin.controllers");
    const { checkNotExistAcount, checkExistAccount, checkNotExistShopWithLatitudeAndLongitude } = require("../middlewares/validates/checkExist");
const { authorize } = require("../middlewares/auth/authorize.js")
const { authenticate } = require("../middlewares/auth/authenticate.js")
const adminRouter = express.Router();


adminRouter.post("/addManager", authenticate, authorize(3), checkNotExistAcount(), addManager)
adminRouter.patch("/editManager/:idStaff", authenticate, authorize(3), editManager)
adminRouter.delete("/deleteManager", authenticate, authorize(3), checkExistAccount(), deleteManager)
adminRouter.get("/getListIngredient", authenticate, authorize(3), getListIngredient)
adminRouter.post("/addIngredient",authenticate, authorize(3), addIngredient)
adminRouter.get("/getDataForChart/:idShop", authenticate, authorize(3), getSixMonthInputAndOuput)
adminRouter.get("/getAllDataForChart", authenticate, authorize(3), getSixMonthInputAndOuputAllShop)
adminRouter.get("/getListManager", authenticate, authorize(3), getListManager)
adminRouter.get("/getListShop", authenticate, authorize(3), getListShop)
adminRouter.post("/addShop", authenticate, authorize(3),checkNotExistShopWithLatitudeAndLongitude(), addShop)
adminRouter.patch("/editShop/:idShop", authenticate, authorize(3), editShop)


module.exports = {
    adminRouter,
}