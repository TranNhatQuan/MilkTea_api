const express = require("express");

const {getOptionToppings} = require("../controllers/order.controllers");

const orderRouter = express.Router();

orderRouter.get("/topping/:idRecipe", getOptionToppings);

module.exports = {
    orderRouter,
}