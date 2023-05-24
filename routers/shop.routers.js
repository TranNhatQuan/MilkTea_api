const express = require("express");

const {menuByTypeForUser} = require("../controllers/shop.controllers");

const shopRouter = express.Router();

shopRouter.get("/type", menuByTypeForUser);

module.exports = {
    shopRouter,
}