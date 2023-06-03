const { raw } = require("body-parser");
const { Shop, Recipe_shop, Recipe, Recipe_type, Cart, Cart_product, Product, Shipping_company, Invoice } = require("../models");
const { QueryTypes, Op, where, STRING } = require("sequelize");
const moment = require('moment-timezone'); // require

const getToppingOfProduct = async (idProduct, idShop) => {
    //console.log('test')
    let listTopping = await Product.findAll({
        where: {
            idProduct: idProduct,
        },
        attributes: ['idRecipe', 'quantity', 'isMain'],
        include: [
            {
                model: Recipe,
                attributes: ['price', 'name', 'image'],
                //required:true,
                include: [{
                    model: Recipe_shop,
                    where: { idShop, isActive: 1 },
                    required: false,
                    attributes: ['discount'],
                }]
            }
        ],
        raw: true
    })
    //console.log(listTopping)
    let totalProduct = 0
    //console.log(listTopping)
    let mes = []
    //let log =''


    let shouldEditList = false;
    listTopping = listTopping.filter(item => {

        if (item['Recipe.Recipe_shops.discount'] == null) {
            shouldEditList = true

            let newItem = {
                name: '' + item['Recipe.name'],
                image: '' + item['Recipe.image'],
                //idProduct
            };
            //og+=item['Recipe.name']
            mes.push(newItem); // Đổ đối tượng mới vào danh sách mới

            return false; // Xóa phần tử khỏi danh sách 
        }
        else {
            let totalItem = item['Recipe.price'] * item['quantity'] * (item['Recipe.Recipe_shops.discount'] / 100);
            totalProduct += totalItem;
            if (item['isMain'] == 1) {

                return false
            }


            return true; // Giữ lại phần tử trong danh sách
        }

    })

    let edit = 'false'
    if (shouldEditList == true) {
        listTopping = []

        edit = 'true'
    }

    listTopping = listTopping.map(item => {

        return {
            idRecipe: item['idRecipe'],
            name: item['Recipe.name'],
            quantity: item['quantity'],
            isMain: item['isMain'],
            price: item['Recipe.price'],

            discount: item['Recipe.Recipe_shops.discount'],
        }
    });

    return { listTopping, totalProduct, mes, edit };
}


const getCurrentCartAndTotal = async (user, idShop) => {

    let cart = await Cart.findAll({
        where: {
            idUser: user.idUser,
            isCurrent: 1,
        },

        include: [
            {
                model: Cart_product,
                attributes: ['idProduct', 'size', 'quantity'],
                required: false,
                include: [
                    {
                        model: Product,
                        required: false,
                        where: { isMain: 1 },
                        attributes: ['quantity'],
                        include: [{
                            model: Recipe,
                            attributes: ['name', 'image', 'price'],
                            include: [{
                                model: Recipe_shop,
                                where: { idShop, isActive: 1 },
                                attributes: ['discount'],
                            }]
                        }]
                    }
                ]
            }
        ],
        raw: true,
        //nest:true,
    })
    let total = 0
    let mess = []
    let nameSet = new Set();
    let listIdProduct = ''

    const promises = cart.map(async item => {
        let { listTopping, totalProduct, mes, edit } = await getToppingOfProduct(item['Cart_products.idProduct'], idShop)

        mes.forEach(item1 => {
            if (!nameSet.has(item1.name)) {
                nameSet.add(item1.name);
                mess.push(item1);
            }
        });
        if (edit == 'true') {
            return {

                idCart: item['idCart'],
                name: null,
                idProduct: item['Cart_products.idProduct'],
                size: item['Cart_products.size'],
                quantityProduct: item['Cart_products.quantity'],
                image: item['Cart_products.Product.Recipe.image'],
                price: item['Cart_products.Product.Recipe.price'],
                discount: item['Cart_products.Product.Recipe.Recipe_shops.discount'],
                listTopping,
                totalProducts: totalProduct * item['Cart_products.quantity']
            };
        }

        total += totalProduct * item['Cart_products.quantity']


        return {

            idCart: item['idCart'],
            name: item['Cart_products.Product.Recipe.name'],
            idProduct: item['Cart_products.idProduct'],
            size: item['Cart_products.size'],
            quantityProduct: item['Cart_products.quantity'],
            image: item['Cart_products.Product.Recipe.image'],
            price: item['Cart_products.Product.Recipe.price'],
            discount: item['Cart_products.Product.Recipe.Recipe_shops.discount'],
            listTopping,
            totalProducts: totalProduct * item['Cart_products.quantity']
        };
    });

    cart = await Promise.all(promises);
    cart = cart.filter(item => {

        if (item['name'] == null) {
            if (item['idProduct'] == null) {
                return false
            }
            listIdProduct += item['idProduct'] + '?'

            return false
        }
        //if(item['listTopping']=='edit') return false
        return true
    })
    //mess =  Array.from(new Set(mess))
    return { cart, total, mess, listIdProduct }
}
const getToppingOptions = async (req, res) => {
    try {

        const idRecipe = Number(req.query.idRecipe);
        const idShop = Number(req.query.idShop)

        const detailRecipe = await Recipe.findOne({
            where: { idRecipe },
            attributes: ['idType'],
        })
        if (detailRecipe == '') {
            return res.status(404).json({ error: 'Không tim thấy thông tin sản phẩm' });
        }
        //console.log(detailRecipe.idType)
        let listTopping = await Recipe_type.findAll({
            where: { idType: detailRecipe.idType },
            //attributes: [['name', 'Recipe.name']],
            attributes: [
                'idRecipe',
            ],
            required: true,
            include: [
                {
                    model: Recipe,
                    attributes: ['name', 'price', 'image'],
                    required: true,
                    include: [
                        {
                            model: Recipe_shop,
                            where: { isActive: 1, idShop },
                            required: true,
                        }
                    ]
                }
            ],
            raw: true
        })
        console.log(listTopping)
        listTopping = listTopping.map(item => {
            return {

                idRecipe: item['idRecipe'],
                name: item['Recipe.name'],
                discount: item['Recipe.Recipe_shops.discount'],
                isActive: item['Recipe.Recipe_shops.isActive'],
                price: item['Recipe.price'],
                image: item['Recipe.image']
            };
        });
        //console.log(listTopping)


        return res.status(200).json({ isSuccess: true, listTopping });
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra lỗi' });
    }
};

const addToCart = async (req, res) => {
    try {
        const idProduct = req.idProduct;
        const { quantityProduct, sizeProduct } = req.body;
        const currentCart = req.currentCart
        if (quantityProduct === '') {
            return res.status(400).json({ isSuccess: false });
        }
        console.log('test1')
        let cartProduct = await Cart_product.findOne({
            where: {
                idProduct: idProduct,
                idCart: currentCart.idCart,
                size: Number(sizeProduct),
            }

        })
        console.log('test2')
        //console.log(cartProduct)
        if (cartProduct !== null) {


            cartProduct.quantity += Number(quantityProduct);

            await cartProduct.save()
        }
        else {

            cartProduct = await Cart_product.create({
                idProduct: idProduct,
                idCart: currentCart.idCart,
                size: Number(sizeProduct),
                quantity: quantityProduct,

            })

        }

        return res.status(200).json({ isSuccess: true, cartProduct });
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra lỗi' });
    }
};
const editCart = async (req, res) => {
    try {
        //console.log('test')
        //const idProduct = req.idProduct;
        const { listIdProduct } = req.body;
        console.log(listIdProduct)
        const currentCart = req.currentCart
        if (listIdProduct == '') {
            return res.status(400).json({ isSuccess: false });
        }
        const listId = listIdProduct.split('?');
        console.log(listId)
        for (let i = 0; i < listId.length; i++) {
            console.log(listId[i])
            //idProduct += listIdRecipe[i] + "," + listQuantity[i] + ";";
            await Cart_product.destroy({
                where: {
                    idProduct: listId[i],
                    idCart: currentCart.idCart,

                }
            })
        }


        return res.status(200).json({ isSuccess: true });
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra lỗi' });
    }
};
const confirmDeleteProductCart = async (req, res) => {
    try {
        //const idProduct = req.idProduct;






        return res.status(200).json({ isSuccess: true });
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra lỗi' });
    }
};
const confirmInvoice = async (req, res) => {
    try {
        //const idProduct = req.idProduct;
        const { total } = req.body
        if (total === undefined) {
            return res.status(400).json({ isSuccess: false });
        }
        if (total === '') {
            return res.status(400).json({ isSuccess: false });
        }
        let invoice = req.invoice
       
        if(invoice.total!=total) return res.status(400).json({ isSuccess: false, mes:'total sai' });
        invoice.status=1
        await invoice.save()

        

        return res.status(200).json({ isSuccess: true, invoice });
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra lỗi' });
    }
};
const getCurrentCart = async (req, res) => {
    try {

        const user = req.user;
        const { idShop } = req.params


        let { cart, total, mess, listIdProduct } = await getCurrentCartAndTotal(user, idShop)
        //console.log(listTopping)
        listIdProduct = listIdProduct.slice(0, -1);

        return res.status(200).json({ isSuccess: true, listIdProduct, mess, cart, total });
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra lỗi' });
    }
};
const getShipFee = async (req, res) => {
    try {

        //const user = req.user;

        const distance = Number(req.query.distance)
        const idShipping_company = Number(req.query.idShipping_company)
        const shipping_company = await Shipping_company.findOne({
            where: { idShipping_company },
            raw: true,
        })
        let total = (distance / 1000) * shipping_company.costPerKm

        //console.log(listTopping)
        return res.status(200).json({ isSuccess: true, total });
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra lỗi' });
    }
};
const getListCompanies = async (req, res) => {
    try {

        //const user = req.user;


        const shipping_company = await Shipping_company.findAll({

        })


        //console.log(listTopping)
        return res.status(200).json({ isSuccess: true, shipping_company });
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra lỗi' });
    }
};
const getCurrentInvoice = async (req, res) => {
    try {

        const user = req.user;
        const invoice = await Invoice.findOne({
            where:{status:{[Op.lt]:5}  },
            include:[
                {
                    model:Cart,
                    required:true,
                    where:{idUser:user.idUser},
                    attributes:[]
                }
            ]
        })

        return res.status(200).json({ isSuccess: true, invoice });
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra lỗi' });
    }
};
const createInvoice = async (req, res) => {
    try {
        const { idShipping_company, shippingFee, idShop } = req.body;
        if (idShipping_company === undefined || shippingFee === undefined || idShop === undefined) {
            return res.status(400).json({ isSuccess: false });
        }
        if (idShipping_company === '' || shippingFee === '' || idShop === '') {
            return res.status(400).json({ isSuccess: false });
        }
        //console.log(idShipping_company)
        const user = req.user
        const currentCart = req.currentCart
        let { cart, total, mess, listIdProduct } = await getCurrentCartAndTotal(user, idShop)
        console.log(listIdProduct)
        if (listIdProduct != '') {
            return res.status(400).json({ isSuccess: false });
        }
        // console.log('test1')
        let invoice =  await Invoice.create({
                idCart: currentCart.idCart,
                idShop,
                idShipping_company,
                shippingFee,
                total,
                date: moment().format("YYYY-MM-DD HH:mm:ss"),
                status: 0,
            })
        
        const idInvoice = invoice.idInvoice
        currentCart.isCurrent=0
        await currentCart.save()


        //console.log(listTopping)
        return res.status(200).json({ isSuccess: true, idInvoice });
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra lỗi' });
    }
};
module.exports = {
    // getDetailTaiKhoan,
    getToppingOptions, editCart, addToCart, getCurrentCart, getShipFee, getListCompanies, createInvoice, confirmDeleteProductCart,
    confirmInvoice, getCurrentInvoice
};