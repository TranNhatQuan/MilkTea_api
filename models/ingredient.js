'use strict';
const {
  Model
} = require('sequelize');

const recipe_ingredient = require('./recipe_ingredient');
module.exports = (sequelize, DataTypes) => {
  class Ingredient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Ingredient.hasMany(models.Recipe_ingredient,{
        foreignKey: "idIngredient"
      })
      Ingredient.hasMany(models.Ingredient_shop,{
        foreignKey: "idIngredient"
      })
      Ingredient.hasMany(models.Import, {
        foreignKey: "idIngredient_shop",
      });
      Ingredient.hasMany(models.Export, {
        foreignKey: "idIngredient_shop",
      });
    }
  }
  Ingredient.init({
    idIngredient: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    image: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
    unitName: {
      allowNull: false,
      type: DataTypes.STRING(10),
    }
  }, {
    sequelize,
    modelName: 'Ingredient',
    timestamps: false,
  });
  return Ingredient;
};