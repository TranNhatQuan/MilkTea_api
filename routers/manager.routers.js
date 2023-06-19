const express = require("express");

const { getReportByDate }
    = require("../controllers/manager.controllers");
const { authorize } = require("../middlewares/auth/authorize.js")
const { authenticate } = require("../middlewares/auth/authenticate.js")
const managerRouter = express.Router();

managerRouter.get("/reportByDate/:date",authenticate,authorize(2), getReportByDate);

module.exports = {
    managerRouter,
}