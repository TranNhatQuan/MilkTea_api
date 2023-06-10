const express = require("express");

const { getToppingOptions, addToCart, getCurrentCart,
        getShipFee, getListCompanies, createInvoice,
        editCart, confirmDeleteProductCart, confirmInvoice,
        getCurrentInvoice, getAllInvoiceUser, getDetailInvoice,
        cancelInvoice, getAllOrder, changeStatusInvoice } = require("../controllers/order.controllers");
const { checkExistProduct, checkExistCurrentCart, checkExistProductCartAndDel,
        checkExistInvoiceStatus, checkExistInvoiceLessThan4 } = require("../middlewares/validates/checkExist");
const { authorize } = require("../middlewares/auth/authorize.js")
const { authenticate } = require("../middlewares/auth/authenticate.js")
const orderRouter = express.Router();

orderRouter.get("/topping", getToppingOptions);
orderRouter.get("/getAllOrder",authenticate, authorize(1), getAllOrder);
orderRouter.get("/currentCart/:idShop", authenticate, authorize(0), getCurrentCart);
orderRouter.put("/completeOrder",authenticate,authorize(1),checkExistInvoiceStatus(1),changeStatusInvoice)
orderRouter.put("/shipperHasTaken",authenticate,authorize(1),checkExistInvoiceStatus(2),changeStatusInvoice)
orderRouter.put("/completeInvoice",authenticate,authorize(1),checkExistInvoiceStatus(3),changeStatusInvoice)
orderRouter.get("/getShipFee", getShipFee);
orderRouter.get("/getListCompanies", getListCompanies);
orderRouter.get("/getCurrentInvoice",authenticate, authorize(0), getCurrentInvoice);
orderRouter.get("/getAllInvoice",authenticate, authorize(0), getAllInvoiceUser);
orderRouter.get("/getDetailInvoice/:idInvoice",authenticate, authorize(0), getDetailInvoice);
orderRouter.delete("/cancelInvoice", authenticate, authorize(0), cancelInvoice)
orderRouter.post("/createInvoice",authenticate, authorize(0),checkExistCurrentCart(),checkExistInvoiceLessThan4(),createInvoice)
orderRouter.put("/confirmInvoice",authenticate,authorize(0),checkExistInvoiceStatus(0),confirmInvoice)
orderRouter.post("/addToCart", authenticate, authorize(0), checkExistProduct(), checkExistCurrentCart(), addToCart)
orderRouter.delete("/deleteProductCart", authenticate, authorize(0), checkExistCurrentCart(),editCart)
orderRouter.delete("/deleteProductCart/:oldIdProduct", authenticate, authorize(0), checkExistCurrentCart(), checkExistProductCartAndDel(),confirmDeleteProductCart)
orderRouter.post("/editProductCart/:oldIdProduct", authenticate, authorize(0), checkExistProduct(), checkExistCurrentCart(),checkExistProductCartAndDel(), addToCart)
module.exports = {
    orderRouter,
}