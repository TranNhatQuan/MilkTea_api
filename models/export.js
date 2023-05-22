'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Export extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      
      Export.belongsTo(models.Ingredient_shop, {
        foreignKey: "idIngredient_shop",
      })
      
    }
  }
  Export.init({
    idIngredient_shop: {
      allowNull: false,
      
      primaryKey: true,
      references: { model: "Ingredient_shops", key: "idIngredient_shop" },
      
      type: DataTypes.STRING
    },
    date: {
      //YYYY-MM-DD
      type: DataTypes.DATEONLY,
      primaryKey: true,
      allowNull: false,
      primaryKey: true,
    },
    
    quantity: {
      allowNull: false,
      type: DataTypes.INTEGER,
    }
  }, {
    sequelize,
    modelName: 'Export',
    timestamps: false,
  });
  return Export;
};