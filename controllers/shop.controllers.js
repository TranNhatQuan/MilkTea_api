const { Shop, Recipe_shop, Recipe } = require("../models");
const { QueryTypes, Op, where } = require("sequelize");

const menuByTypeForStaff = async (req, res) => {
    try {
        
        const staff = req.staff
        let listType = []
        let menu
        if (req.query.idType !== '') {
            listType = req.query.idType.split(',').map(Number);
            menu = await Recipe_shop.findAll({
                where: {
                    idShop: staff.idShop,
                    
                },
                attributes: ['discount'],
                include: [{
                    model: Recipe,
                    where: { idType: { [Op.in]: listType } },
                }
                ]
            })
        }
        else {
            menu = await Recipe_shop.findAll({
                where: {
                    idShop: staff.idShop,
                    
                },
                attributes: ['discount'],
                include: [{
                    model: Recipe,

                }
                ]
            })
        }
        return res.status(200).json({ isSuccess: true, menu });
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra lỗi' });
    }
};
const editRecipeShop = async (req, res) => {
    try {
        const staff = req.staff
        const { idRecipe } = req.params
        const { isActive, discount } = req.body;
        if (isActive === undefined||discount===undefined) {
            return res.status(400).json({ isSuccess: false, mes:'editRecipeShop' });
        }
        if (isActive === ''||discount==='') {
            return res.status(400).json({ isSuccess: false, mes:'editRecipeShop' });
        }
        //console.log(typeof(parseInt(isActive)))
        let recipe
        if(parseInt(discount)<0||parseInt(discount)>100) return res.status(400).json({ isSuccess: false, mes:'editRecipeShop' });
        if(isActive==1||isActive==0){
            recipe = await Recipe_shop.findOne({
                where: {
                    idRecipe
                },
            })
            recipe.isActive=isActive
            recipe.discount=discount
            await recipe.save()
        }
        else  return res.status(400).json({ isSuccess: false, mes:'editRecipeShop' });

        return res.status(200).json({ isSuccess: true, recipe });
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra lỗi, editRecipeShop' });
    }
};
const menuByTypeForUser = async (req, res) => {
    try {
        if (req.query.idShop == '') {
            return res.status(400).json({ isSuccess: true });
        }
        const idShop = parseInt(req.query.idShop);
        let listType = []
        let menu
        if (req.query.idType !== '') {
            listType = req.query.idType.split(',').map(Number);
            menu = await Recipe_shop.findAll({
                where: {
                    idShop: idShop,
                    isActive: 1,
                },
                attributes: ['discount'],
                include: [{
                    model: Recipe,
                    where: { idType: { [Op.in]: listType } },
                }
                ]
            })
        }
        else {
            menu = await Recipe_shop.findAll({
                where: {
                    idShop: idShop,
                    isActive: 1,
                },
                attributes: ['discount'],
                include: [{
                    model: Recipe,

                }
                ]
            })
        }





        return res.status(200).json({ isSuccess: true, menu });
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra lỗi' });
    }
};



module.exports = {
    // getDetailTaiKhoan,
    menuByTypeForUser, menuByTypeForStaff, editRecipeShop
};