const express = require("express");

const {getToppingOptions,addToCart, getCurrentCart} = require("../controllers/order.controllers");
const { checkExistProduct, checkExistCurrentCart } = require("../middlewares/validates/checkExist");
const {authorize} = require("../middlewares/auth/authorize.js")
const { authenticate } = require("../middlewares/auth/authenticate.js")
const orderRouter = express.Router();

orderRouter.get("/topping/:idRecipe", getToppingOptions);
orderRouter.get("/currentCart",authenticate,authorize(0), getCurrentCart);
orderRouter.post("/addToCart",authenticate,authorize(0),checkExistProduct(),checkExistCurrentCart(), addToCart)
module.exports = {
    orderRouter,
}