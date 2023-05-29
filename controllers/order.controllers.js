const { raw } = require("body-parser");
const { Shop, Recipe_shop, Recipe, Recipe_type, Cart, Cart_product, Product, Shipping_company, Invoice } = require("../models");
const { QueryTypes, Op, where } = require("sequelize");

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
                attributes: ['price', 'name'],
                include:[{
                    model: Recipe_shop,
                    where:{idShop},
                    attributes: ['discount'],
                }]
            }
        ],
        raw: true
    })
    //console.log(listTopping)
    let totalProduct = 0
    console.log(listTopping)
    listTopping = listTopping.map(item => {
        //console.log(item['Recipe.Recipe_shop.discount'])
        let totalItem = item['Recipe.price'] * item['quantity']*(item['Recipe.Recipe_shops.discount']/100)
        totalProduct += totalItem
        return {

            idRecipe: item['idRecipe'],
            name: item['Recipe.name'],
            quantity: item['quantity'],
            isMain: item['isMain'],
            price: item['Recipe.price'],
            discount: item['Recipe.Recipe_shops.discount'],
        };
    });
    return { listTopping, totalProduct };
}


const getCurrentCartAndTotal = async(user,idShop)=>{
    
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
                            attributes: ['name', 'image'],
                        }]
                    }
                ]
            }
        ],
        raw: true,
        //nest:true,
    })
    let total = 0
    const promises = cart.map(async item => {
        let { listTopping, totalProduct } = await getToppingOfProduct(item['Cart_products.idProduct'], idShop)
        total += totalProduct * item['Cart_products.quantity']
        return {

            idCart: item['idCart'],
            name: item['Cart_products.Product.Recipe.name'],
            idProduct: item['Cart_products.idProduct'],
            size: item['Cart_products.size'],
            quantityProduct: item['Cart_products.quantity'],
            image: item['Cart_products.Product.Recipe.image'],
            listTopping,
            totalProducts: totalProduct * item['Cart_products.quantity']
        };
    });
    cart = await Promise.all(promises);
    return {cart, total}
}
const createInvoice = async (user, shippingFee, idShipping_company,idShop) => {
    //console.log('test')
    const{cart, total} = await getCurrentCartAndTotal(user,idShop)
    
    
    let invoice = await Invoice.create({

    })

    
    return ;
}
const getToppingOptions = async (req, res) => {
    try {

        const { idRecipe } = req.params;


        const detailRecipe = await Recipe.findOne({
            where: { idRecipe },
            attributes: ['idType'],
        })
        if (detailRecipe == '') {
            return res.status(404).json({ error: 'Không tim thấy thông tin sản phẩm' });
        }
        let listTopping = await Recipe_type.findAll({
            where: { idType: detailRecipe.idType },
            //attributes: [['name', 'Recipe.name']],
            attributes: [
                'idRecipe',
            ],
            include: [
                {
                    model: Recipe,
                    attributes: ['name', 'price', 'image'],
                    include: [
                        {
                            model: Recipe_shop,


                        }
                    ]
                }
            ],
            raw: true
        })
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

const getCurrentCart = async (req, res) => {
    try {

        const user = req.user;
        const {idShop} = req.params


        const{cart, total} = await getCurrentCartAndTotal(user,idShop)
        //console.log(listTopping)
        return res.status(200).json({ isSuccess: true, cart, total });
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
const createInvoiceAndSubIngredient = async (req, res) => {
    try {
        const {idShipping_company,shippingFee} = req.body;
        if (idShipping_company === '' && shippingFee === '') {
            return res.status(400).json({ isSuccess: false });
          }
        

        
        
     

        //console.log(listTopping)
        return res.status(200).json({ isSuccess: true });
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra lỗi' });
    }
};
module.exports = {
    // getDetailTaiKhoan,
    getToppingOptions, addToCart, getCurrentCart, getShipFee, getListCompanies, createInvoiceAndSubIngredient
};