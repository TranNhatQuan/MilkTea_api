const express = require("express");

const { getToppingOptions, addToCart, getCurrentCart,
        getShipFee, getListCompanies } = require("../controllers/order.controllers");
const { checkExistProduct, checkExistCurrentCart, checkExistProductCartAndDel } = require("../middlewares/validates/checkExist");
const { authorize } = require("../middlewares/auth/authorize.js")
const { authenticate } = require("../middlewares/auth/authenticate.js")
const orderRouter = express.Router();

orderRouter.get("/topping/:idRecipe", getToppingOptions);
orderRouter.get("/currentCart", authenticate, authorize(0), getCurrentCart);
orderRouter.get("/getShipFee", getShipFee);
orderRouter.get("/getListCompanies", getListCompanies);
orderRouter.post("/addToCart", authenticate, authorize(0), checkExistProduct(), checkExistCurrentCart(), addToCart)
orderRouter.post("/editProductCart/:oldIdProduct", authenticate, authorize(0), checkExistProduct(), checkExistCurrentCart(),checkExistProductCartAndDel(), addToCart)
module.exports = {
    orderRouter,
}