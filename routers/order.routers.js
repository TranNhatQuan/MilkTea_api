const express = require("express");

const {getToppingOptions} = require("../controllers/order.controllers");

const orderRouter = express.Router();

orderRouter.get("/topping/:idRecipe", getToppingOptions);

module.exports = {
    orderRouter,
}