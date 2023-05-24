const { Shop,Recipe_shop, Recipe } = require("../models");
const { QueryTypes, Op, where } = require("sequelize");



const menuByTypeForUser = async (req, res) => {
    try {
        if(req.query.idShop==''){
            return res.status(400).json({isSuccess: true});
        }
        const idShop = parseInt(req.query.idShop);
        let listType=[]
        let menu
        if(req.query.idType!==''){
            listType = req.query.idType.split(',').map(Number);
            menu = await Recipe_shop.findAll({
                where:{
                    idShop:idShop,
                    isActive:1,
                },
                attributes: ['discount'],
                include:[{
                    model: Recipe,
                    where: {idType:{ [Op.in]:listType }}, 
                }
                ]
            })
        }
        else{
            menu = await Recipe_shop.findAll({
                where:{
                    idShop:idShop,
                    isActive:1,
                },
                attributes: ['discount'],
                include:[{
                    model: Recipe,
                    
                }
                ]
            })
        }
        
        
        
        

        return res.status(200).json({isSuccess: true, menu});
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra lỗi' });
    }
};



module.exports = {
    // getDetailTaiKhoan,
    menuByTypeForUser,
};