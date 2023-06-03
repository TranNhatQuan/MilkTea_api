const express = require("express");

const { getToppingOptions, addToCart, getCurrentCart,
        getShipFee, getListCompanies, createInvoice,
        editCart, confirmDeleteProductCart, confirmInvoice,
        getCurrentInvoice, getAllInvoiceUser, getDetailInvoice } = require("../controllers/order.controllers");
const { checkExistProduct, checkExistCurrentCart, checkExistProductCartAndDel,
        checkExistInvoiceStatus0, checkExistInvoiceLessThan5 } = require("../middlewares/validates/checkExist");
const { authorize } = require("../middlewares/auth/authorize.js")
const { authenticate } = require("../middlewares/auth/authenticate.js")
const orderRouter = express.Router();

orderRouter.get("/topping", getToppingOptions);
orderRouter.get("/currentCart/:idShop", authenticate, authorize(0), getCurrentCart);
orderRouter.get("/getShipFee", getShipFee);
orderRouter.get("/getListCompanies", getListCompanies);
orderRouter.get("/getCurrentInvoice",authenticate, authorize(0), getCurrentInvoice);
orderRouter.get("/getAllInvoice",authenticate, authorize(0), getAllInvoiceUser);
orderRouter.get("/getDetailInvoice/:idInvoice",authenticate, authorize(0), getDetailInvoice);
orderRouter.post("/createInvoice",authenticate, authorize(0),checkExistCurrentCart(),checkExistInvoiceLessThan5(),createInvoice)
orderRouter.put("/confirmInvoice",authenticate,authorize(0),checkExistInvoiceStatus0(),confirmInvoice)
orderRouter.post("/addToCart", authenticate, authorize(0), checkExistProduct(), checkExistCurrentCart(), addToCart)
orderRouter.delete("/deleteProductCart", authenticate, authorize(0), checkExistCurrentCart(),editCart)
orderRouter.delete("/deleteProductCart/:oldIdProduct", authenticate, authorize(0), checkExistCurrentCart(), checkExistProductCartAndDel(),confirmDeleteProductCart)
orderRouter.post("/editProductCart/:oldIdProduct", authenticate, authorize(0), checkExistProduct(), checkExistCurrentCart(),checkExistProductCartAndDel(), addToCart)
module.exports = {
    orderRouter,
}