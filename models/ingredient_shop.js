'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ingredient_shop extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      
      Ingredient_shop.belongsTo(models.Ingredient, {
        foreignKey: "idIngredient",
      })
      Ingredient_shop.belongsTo(models.Shop, {
        foreignKey: "idShop",
      })
      Ingredient_shop.hasMany(models.Import, {
        foreignKey: "idIngredient_shop",
      });
      Ingredient_shop.hasMany(models.Export, {
        foreignKey: "idIngredient_shop",
      });
    }
  }
  Ingredient_shop.init({
    idIngredient_shop: {
      allowNull: false,
      
      primaryKey: true,
  
      type: DataTypes.STRING,
    },
    
    
    quantity: {
      allowNull: false,
      type: DataTypes.INTEGER,
    }
  }, {
    sequelize,
    modelName: 'Ingredient_shop',
    timestamps: false,
  });
  return Ingredient_shop;
};