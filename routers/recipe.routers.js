const express = require("express");

const {menuByTypeForUser} = require("../controllers/recipe.controllers");

const recipeRouter = express.Router();

recipeRouter.get("/type", menuByTypeForUser);

module.exports = {
    recipeRouter,
}