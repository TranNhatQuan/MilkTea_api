'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Shop extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Shop.hasMany(models.Recipe_shop,{
        foreignKey: "idShop",
        
      });
    }
  }
  Shop.init({
    idShop: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    
    address: {
      allowNull: false,
      type: DataTypes.STRING
    },
    isActive:{
      allowNull:false,
      type: DataTypes.INTEGER
    },
    image: {
      allowNull: false,
      type: DataTypes.TEXT
    }
  }, {
    sequelize,
    modelName: 'Shop',
    timestamps: false,
  });
  return Shop;
};