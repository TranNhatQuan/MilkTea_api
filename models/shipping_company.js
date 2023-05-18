'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Shipping_company extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      
      Shipping_company.hasMany(models.Cart, {
        foreignKey: "idShipping_company",
      });
    }
  }
  Shipping_company.init({
    idShipping_company: {
      allowNull: false,
      
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    costPerKm: {
      allowNull: false,
      type: DataTypes.INTEGER,
    }
  }, {
    sequelize,
    modelName: 'Shipping_company',
    timestamps: false,
  });
  return Shipping_company;
};