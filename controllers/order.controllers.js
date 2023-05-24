const { raw } = require("body-parser");
const { Shop, Recipe_shop, Recipe, Recipe_type } = require("../models");
const { QueryTypes, Op, where } = require("sequelize");



const getOptionToppings = async (req, res) => {
    try {

        const { idRecipe } = req.params;


        const detailRecipe = await Recipe.findOne({
            where: { idRecipe },
            attributes: ['idType'],
        })
        if (detailRecipe == '') {
            return res.status(404).json({ error: 'Không tim thấy thông tin sản phẩm' });
        }
        let optionToppings = await Recipe_type.findAll({
            where: { idType: detailRecipe.idType },
            //attributes: [['name', 'Recipe.name']],
            attributes: [
                'idRecipe' ,
                ],
            include: [
                {
                    model: Recipe,
                    attributes: ['name','price','image'],
                    include:[
                        {
                            model: Recipe_shop,
                            
                            
                        }
                    ]
                }
            ],
            raw:true
        })
        optionToppings = optionToppings.map(item => {
            return {
                
                idRecipe:item['idRecipe'],
                name: item['Recipe.name'],
                discount: item['Recipe.Recipe_shops.discount'],
                isActive: item['Recipe.Recipe_shops.isActive'],
                price: item['Recipe.price'],
                image: item['Recipe.image']
            };
        });



        return res.status(200).json({ isSuccess: true, optionToppings });
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra lỗi' });
    }
};



module.exports = {
    // getDetailTaiKhoan,
    getOptionToppings,
};