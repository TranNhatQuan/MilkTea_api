const express = require("express");

const {menuByTypeForUser, menuByTypeForStaff, editRecipeShop} = require("../controllers/shop.controllers");
const { authorize } = require("../middlewares/auth/authorize.js")
const { authenticate } = require("../middlewares/auth/authenticate.js")

const shopRouter = express.Router();

shopRouter.get("/type", menuByTypeForUser);
shopRouter.put("/editRecipeShop/:idRecipe",authenticate,authorize(2), editRecipeShop);
shopRouter.get("/typeForStaff",authenticate,authorize(1), menuByTypeForStaff);

module.exports = {
    shopRouter,
}