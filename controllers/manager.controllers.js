const { Shop, Recipe_shop, Recipe, Invoice, Staff, Account } = require("../models");
const { QueryTypes, Op, where, STRING } = require("sequelize");
const moment = require('moment-timezone'); // require
const { getDetailCart } = require("./order.controllers")

const getTotal = (listInvoices) => {
    let total =0
    //let total =0
   
    listInvoices.forEach((invoice) => {
        total += invoice.total
       console.log(invoice.total)
    });

    return total
}

const getTopSellerByInvoices = (listInvoices, quantity) => {
    const nameCounts = {};
    let countProducts =0
    let countProductWithTopping = 0
    let countToppings =0
    //let total =0
    const toppingCounts = {};
    listInvoices.forEach((invoice) => {
        invoice.detail.forEach((recipe) => {
            const name = recipe.name;
            const idRecipe = recipe.idRecipe;
            const quantityProduct = recipe.quantityProduct
            const image = recipe.image
            countProducts += quantityProduct
            if (nameCounts[name]) {
                nameCounts[name].count+=quantityProduct;
            } else {
                nameCounts[name] = {
                    count: quantityProduct,
                    idRecipes: idRecipe,
                    image: image,
                };
            }
            if(recipe.listTopping!=''){
                countProductWithTopping+=quantityProduct
            }
            recipe.listTopping.forEach((item) => {
                const nameTopping = item.name;
                const idItem = item.idRecipe;
                const quantity = item.quantity*quantityProduct
                const imageTopping = item.image
                countToppings += quantity
                if (toppingCounts[nameTopping]) {
                    toppingCounts[nameTopping].count+=quantity;
                } else {
                    toppingCounts[nameTopping] = {
                        count: quantity,
                        idRecipes: idItem,
                        image:imageTopping
                    };
                }
            })
        });
    });
    //console.log(countToppings)
    
    const sortedNames = Object.keys(nameCounts).sort((a, b) => nameCounts[b].count - nameCounts[a].count);
    const sortedToppings = Object.keys(toppingCounts).sort((a, b) => toppingCounts[b].count - toppingCounts[a].count);

    const topNames = sortedNames.slice(0, quantity).map((name) => ({
        name: name,
        idRecipes: nameCounts[name].idRecipes,
        image: nameCounts[name].image,
        count: nameCounts[name].count,
    }));
   
    const topToppings = sortedToppings.slice(0, quantity).map((name) => ({
        name: name,
        idRecipes: toppingCounts[name].idRecipes,
        image: toppingCounts[name].image,
        count: toppingCounts[name].count,
    }));
 
    return {topNames, topToppings, countProducts, countToppings, countProductWithTopping}
}

const getReportByDate = async (req, res) => {
    try {
        const staff = req.staff
        const { date } = req.params
        if (req.query.quantity == ''||req.query.quantity == undefined) {
            return res.status(400).json({ isSuccess: false });
        }
        const quantity = req.query.quantity;
        if (req.query.type == ''||req.query.type == undefined) {
            return res.status(400).json({ isSuccess: false });
        }
        const type = req.query.type
        let startDate, endDate
        if(type=='day'||type=='month'||type=='year'){
            startDate = moment(date).startOf(type).toDate();
            endDate = moment(date).endOf(type).toDate();
        }
        else return res.status(400).json({ isSuccess: false, mes:'type sai' });
        if (date === undefined) {
            return res.status(400).json({ isSuccess: false });
        }
        if (date === '') {
            return res.status(400).json({ isSuccess: false });
        }
        
        
        let invoices = await Invoice.findAll({
            where: {
                idShop: staff.idShop,
                date: {
                    [Op.gte]: startDate,
                    [Op.lt]: endDate
                },
                status: {
                    [Op.ne]: 0
                }

            },
            attributes: ['idInvoice', 'date', 'status', 'idCart','total'],
            //order: [['date', 'ASC']],

            raw: true,
        })
        //console.log(invoices)
        //let  total = getTotal(invoices)
        let total = 0
        const promises = invoices.map(async item => {
            
            let detail = await getDetailCart(item['idCart'])
            total += item['total']
            return {

                idInvoices: item['idInvoice'],
                date: item['date'],

                detail,

            };
        });

        invoices = await Promise.all(promises);
        let countInvoices = 0
        countInvoices = invoices.length
        let {topNames, topToppings, countProducts, countToppings, countProductWithTopping} = getTopSellerByInvoices(invoices, quantity)
        

        return res.status(200).json({ isSuccess: true,total,topNames,topToppings, countProducts, countToppings, countProductWithTopping, countInvoices });
    } catch (error) {
        res.status(500).json({ error, mes: 'reportByDate' });
    }
};
const getListStaff = async (req, res) => {
    try {
        const staff = req.staff
        const { date } = req.params
        
        let listStaffs = await Staff.findAll({
            where: {idShop: staff.idShop},
            attributes:['idStaff','name'],
            include:[
                {
                    model: Account,
                    attributes:['role','phone'],
                }
            ],
            raw:true,

        })
        
        listStaffs = listStaffs.map(item => {

            return {
                idStaff: item['idStaff'],
                name: item['name'],
                role: item['Account.role'],
                phone: item['Account.phone'],
    
            }
        });
        return res.status(200).json({ isSuccess: true, listStaffs});
    } catch (error) {
        res.status(500).json({ error, mes: 'getListStaff' });
    }
};



module.exports = {
    // getDetailTaiKhoan,
    getReportByDate, getListStaff
};